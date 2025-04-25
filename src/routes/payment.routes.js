// routes/payment.routes.js
import express from 'express';
import { createPayment, handleWebhook } from '../controllers/payment.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import mercadopago from 'mercadopago';
import { client } from '../controllers/payment.controller.js';

const router = express.Router();

const { Payment } = mercadopago; 

router.post('/create-payment', authRequired, createPayment);

router.post('/webhook', handleWebhook);

router.get('/check-payment/:paymentId', authRequired, async (req, res) => {
    try {
      const payment = new Payment(client);
      const result = await payment.get({ id: req.params.paymentId });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;