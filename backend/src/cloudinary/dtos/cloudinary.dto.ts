export interface CloudinaryGetSignatureResponseDto {
    timestamp: number;
    signature: string;
    cloudName: string | undefined;
    apiKey: string | undefined;
    folder: string;
}
