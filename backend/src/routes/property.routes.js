import express from 'express';
import { imageUpload, videoUpload } from '../middlewares/upload.js';
import { debugUploadFields } from '../middlewares/debugLogger.js';
import { createPropertyWithMedia } from '../controllers/property.controller.js';

const router = express.Router();

router.post(
  '/create',
  debugUploadFields, // ✅ Custom logging middleware
  (req, res, next) => {
    imageUpload.array('images', 10)(req, res, function (err) {
      if (err) return next(err);
      videoUpload.array('videos', 5)(req, res, function (err) {
        if (err) return next(err);
        next();
      });
    });
  },
  createPropertyWithMedia
);

export default router;
