import { axiosClient } from "./axiosClient";
import type { CloudinaryGetSignatureResponseDto } from "../../../shared/api-types";

export interface CloudinaryUploadResponse {
    secure_url: string;
    // other fields omitted for brevity
}

export const getCloudinarySignature = async (): Promise<CloudinaryGetSignatureResponseDto> => {
    console.log('[photoClient] App requesting Cloudinary signature from API...');
    const response = await axiosClient.post<CloudinaryGetSignatureResponseDto>('/cloudinary/signature');
    console.log('[photoClient] Received Cloudinary signature successfully:', response.data);
    return response.data;
};

export const uploadPhotoToCloudinary = async (
    fileUri: string,
    fileName: string,
    fileType: string,
    signatureData: CloudinaryGetSignatureResponseDto
): Promise<string> => {
    const uploadData = new FormData();
    uploadData.append('file', {
        uri: fileUri,
        name: fileName,
        type: fileType,
    } as any);
    uploadData.append('api_key', signatureData.apiKey || '');
    uploadData.append('timestamp', signatureData.timestamp.toString());
    uploadData.append('signature', signatureData.signature);
    uploadData.append('folder', signatureData.folder);

    console.log('[photoClient] Uploading photo to Cloudinary URL:', `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`);
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error('[photoClient] Cloudinary photo upload failed with status:', uploadRes.status, 'Response:', errorText);
        throw new Error(`Failed to upload image to Cloudinary: ${errorText}`);
    }

    const cloudinaryResponse: CloudinaryUploadResponse = await uploadRes.json();
    console.log('[photoClient] Cloudinary photo upload successful! Secure URL:', cloudinaryResponse.secure_url);
    return cloudinaryResponse.secure_url;
};
