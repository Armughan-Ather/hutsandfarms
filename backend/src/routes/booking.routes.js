import express from 'express';
import { cancelBooking, completeBooking, confirmBooking, createBooking, viewPropertyBookings } from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { verifyPropertyToken } from '../middlewares/propertyAuth.middleware.js';
const router = express.Router();

router.post('/create', verifyPropertyToken, createBooking);
router.get('/', verifyPropertyToken, viewPropertyBookings);
router.post('/complete',verifyPropertyToken,completeBooking);
router.post('/cancel',verifyPropertyToken,cancelBooking);
router.post('/confirm',verifyPropertyToken,confirmBooking);
export default router;