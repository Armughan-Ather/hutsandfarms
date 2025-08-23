import express from 'express';
import { addProperty, editProperty,deletePropertyMedia,uploadPropertyMedia, loginProperty,getProperty } from '../controllers/property.controller.js';
import { verifyPropertyToken } from '../middlewares/propertyAuth.middleware.js';
import  uploadFiles  from '../middlewares/upload.js';
const router = express.Router();
router.route('/').get(verifyPropertyToken,getProperty);
router.post('/add', uploadFiles, addProperty);
router.route('/edit').post(editProperty);
router.delete('/delete/media', deletePropertyMedia);
router.post('/upload/media', uploadFiles, uploadPropertyMedia);
router.route('/login').post(loginProperty)
export default router;
