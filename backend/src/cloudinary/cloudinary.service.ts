import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'government_documents',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            let errorMessage = 'Failed to upload file';
            if (error.message.includes('File size too large')) {
              errorMessage = 'File size exceeds maximum allowed';
            }
            reject(new HttpException(errorMessage, HttpStatus.BAD_REQUEST));
          }
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async getFileUrl(publicId: string): Promise<string> {
    try {
      return cloudinary.url(publicId, {
        secure: true,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to generate file URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
  }

}