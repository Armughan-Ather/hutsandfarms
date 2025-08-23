import express from 'express';
import { createBooking, viewPropertyBookings } from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { verifyPropertyToken } from '../middlewares/propertyAuth.middleware.js';
const router = express.Router();

router.post('/create', authenticate, createBooking);
router.get('/', verifyPropertyToken, viewPropertyBookings);
export default router;