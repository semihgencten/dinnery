import { Controller, Post, Req, HttpStatus, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '../auth/auth.guard';

export interface CloudinarySignatureResponse {
    timestamp: number;
    signature: string;
    cloudName: string | undefined;
    apiKey: string | undefined;
    folder: string;
}

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('signature')
    @UseGuards(AuthGuard)
    async getSignature(@Req() req: any): Promise<CloudinarySignatureResponse> {
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
