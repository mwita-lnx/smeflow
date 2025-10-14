import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/environment';
import { logger } from '../shared/utils/logger';

class CloudinaryService {
  constructor() {
    if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
      cloudinary.config({
        cloud_name: config.cloudinary.cloudName,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.apiSecret,
      });
    }
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      // Convert buffer to base64
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: `smeflow/${folder}`,
        resource_type: 'auto',
      });

      return result.secure_url;
    } catch (error) {
      logger.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  async uploadMultipleImages(files: Express.Multer.File[], folder: string): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract public_id from URL
      const parts = imageUrl.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      const folder = parts.slice(-3, -1).join('/');

      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    } catch (error) {
      logger.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
