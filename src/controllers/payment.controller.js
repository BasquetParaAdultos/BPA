// controllers/payment.controller.js
import mercadopago from 'mercadopago';
import User from '../models/user.model.js';


const { MercadoPagoConfig, Preference, Payment } = mercadopago;

// Configurar cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});


export const createPayment = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const preference = new Preference(client);
    
    const response = await preference.create({
      body: {
        items: [
          {
            title: 'Mensualidad Escuela de Basquet',
            unit_price: 5000,
            quantity: 1,
            currency_id: 'ARS' // Añadir moneda
          }
        ],
        back_urls: {
          success: 'http://localhost:5173/payment/success',
          failure: 'http://localhost:5173/payment/failure',
          pending: 'http://localhost:5173/payment/pending'
        },
        auto_return: 'approved',
        notification_url: 'https://2ecb-190-191-21-192.ngrok-free.app/api/webhook', // Añadir URL de notificación
        metadata: {
          user_id: userId.toString()
        }
      }
    });

    res.json({ init_point: response.init_point });
  } catch (error) {
    console.error("Error en createPayment:", error);
    res.status(500).json({ message: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    console.log("Webhook recibido:", req.query); // Verifica los parámetros

    const paymentId = req.query["data.id"];
    console.log("Payment ID recibido:", paymentId);
    const type = req.query.type;

    if (type === "payment" && paymentId) {
      // Configurar cliente de MP
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      });
      const payment = new Payment(client);

      // Obtener detalles del pago
      const result = await payment.get({ id: paymentId });
      console.log("Detalles del pago:", JSON.stringify(result, null, 2));
      console.log("Resultado de la API:", result);

      // Validar metadata
      if (result.metadata && result.metadata.user_id) {
        await User.findByIdAndUpdate(result.metadata.user_id, {
          payment_status: "paid",
          subscription_date: new Date(),
          expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        console.log(`Usuario ${result.metadata.user_id} actualizado como pagado`);
      } else {
        console.error("Metadata.user_id no encontrado en el pago");
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error en webhook:", {
      message: error.message,
      stack: error.stack, // <--- Para ver la línea del error
    });
    res.status(500).json({ message: error.message });
  }
};