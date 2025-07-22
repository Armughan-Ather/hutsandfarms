import express from 'express';
// import { imageUpload, videoUpload } from '../middlewares/upload.js';
// import { debugUploadFields } from '../middlewares/debugLogger.js';
import { addProperty } from '../controllers/property.controller.js';
import  uploadFiles  from '../middlewares/upload.js';
const router = express.Router();

router.post('/add', uploadFiles, addProperty);
export default router;
