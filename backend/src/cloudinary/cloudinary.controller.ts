import { Controller, Post, Req, HttpStatus, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '../auth/auth.guard';
import { CloudinaryGetSignatureResponseDto } from './dtos/cloudinary.dto';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('signature')
    @UseGuards(AuthGuard)
    async getSignature(@Req() req: any): Promise<CloudinaryGetSignatureResponseDto> {
        console.log('[CloudinaryController] Received request to generate Cloudinary signature');
        try {
            const userId = req.user?.sub || req.user?.id || 'default_user';
            console.log(`[CloudinaryController] Generating signature for user: ${userId}`);

            const signatureData = this.cloudinaryService.generateSignature(userId);
            console.log('[CloudinaryController] Returning generated signature and config params');
            return signatureData;
        } catch (error) {
            console.error('[CloudinaryController] Failed to generate signature:', error);
            throw new InternalServerErrorException("Failed to generate signature");
        }
    }
}
