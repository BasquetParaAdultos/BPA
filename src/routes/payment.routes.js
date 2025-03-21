// routes/payment.routes.js
import express from 'express';
import { createPayment, handleWebhook } from '../controllers/payment.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

router.post('/create-payment', authRequired, createPayment);

router.post('/webhook', handleWebhook);

export default router;