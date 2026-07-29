import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env, hasCloudinaryConfig } from "@Veershree-portfolio/env/server";

@Injectable()
export class UploadsService {
  constructor() {
    if (hasCloudinaryConfig()) {
      cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        secure: true,
      });
    }
  }

  async saveImage(file: Express.Multer.File): Promise<string> {
    if (!hasCloudinaryConfig()) {
      throw new ServiceUnavailableException(
        "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      );
    }

    const result = await this.uploadBuffer(file.buffer);
    return result.secure_url;
  }

  private uploadBuffer(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: env.CLOUDINARY_FOLDER,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload returned no result"));
            return;
          }
          resolve(result);
        }
      );

      stream.end(buffer);
    });
  }
}
