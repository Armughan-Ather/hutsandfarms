import express from 'express';
import { addOwner } from '../controllers/owner.controller.js';

const router = express.Router();

router.post('/add', addOwner);

export default router;