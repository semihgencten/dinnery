import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {

    constructor(private configService: ConfigService) { }

    generateSignature(userId: string) {
        console.log(`[CloudinaryService] Calculating signature details...`);

        const apiSecret = this.configService.get<string>('cloudinary.apiSecret');
        const cloudName = this.configService.get<string>('cloudinary.cloudName');
        const apiKey = this.configService.get<string>('cloudinary.apiKey');

        if (!apiSecret || !cloudName || !apiKey) {
            console.error('[CloudinaryService] Missing Cloudinary environment variables.');
            throw new InternalServerErrorException('Cloudinary configuration is missing. Please check your environment variables.');
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = `users/${userId}`;

        console.log(`[CloudinaryService] Signing request with folder: ${folder}, timestamp: ${timestamp}`);
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            apiSecret
        );

        console.log(`[CloudinaryService] Signature calculation successful.`);
        console.log(`[CloudinaryService] Returning signature details:`, {
            timestamp,
            cloudName,
            apiKey,
            folder: `users/${userId}`,
        });

        return {
            timestamp,
            signature,
            cloudName,
            apiKey,
            folder: `users/${userId}`,
        };
    }
}
