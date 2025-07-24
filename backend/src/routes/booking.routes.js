import express from 'express';
import { createBooking } from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticate, createBooking);

export default router;