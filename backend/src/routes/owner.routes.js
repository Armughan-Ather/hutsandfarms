import express from 'express';
import { addOwner, loginOwner } from '../controllers/owner.controller.js';
import { verifyOwnerToken } from '../middlewares/ownerAuth.middleware.js';
const router = express.Router();

router.post('/add', addOwner);
router.route('/login').post(loginOwner)

export default router;