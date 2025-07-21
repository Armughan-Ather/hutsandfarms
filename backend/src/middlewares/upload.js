import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hutsandfarms/images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hutsandfarms/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi'],
  },
});

export const imageUpload = multer({ storage: imageStorage });
export const videoUpload = multer({ storage: videoStorage });

// 👇 Combine both using fields
export const mediaUpload = {
  images: imageUpload.array('images', 10),
  videos: videoUpload.array('videos', 5)
};
