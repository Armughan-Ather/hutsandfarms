// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '../utils/cloudinary.js';

// const imageStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'hutsandfarms/images',
//     allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
//   },
// });

// const videoStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'hutsandfarms/videos',
//     resource_type: 'video',
//     allowed_formats: ['mp4', 'mov', 'avi'],
//   },
// });

// export const imageUpload = multer({ storage: imageStorage });
// export const videoUpload = multer({ storage: videoStorage });

// // 👇 Combine both using fields
// export const mediaUpload = {
//   images: imageUpload.array('images', 10),
//   videos: videoUpload.array('videos', 5)
// };
import multer from 'multer';
import path from 'path';

// Configure storage (using memory storage for Cloudinary)
const storage = multer.memoryStorage();

// File filter to allow only images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/mpeg',
    'video/webm',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
});

// Middleware to handle multiple images and videos
const uploadFiles = upload.fields([
  { name: 'images', maxCount: 10 }, // Allow up to 10 images
  { name: 'videos', maxCount: 5 },  // Allow up to 5 videos
]);

export default uploadFiles;