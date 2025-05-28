// controllers/payment.controller.js
import mercadopago from 'mercadopago';
import User from '../models/user.model.js';
import crypto from 'crypto';


const { MercadoPagoConfig, Preference, Payment } = mercadopago;

// Configurar cliente de Mercado Pago
export const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

// Función de verificación de firma 
const verifySignature = (receivedSignature, rawBodyBuffer) => {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  // FORZAR el body a string minificado (igual que MP)
  const rawBodyMinified = JSON.stringify(JSON.parse(rawBodyBuffer.toString('utf8')));

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBodyMinified)
    .digest('hex');

  return generatedSignature === receivedSignature;
};



export const createPayment = async (req, res) => {
  try {
    // Paso 1: Obtener nuevos parámetros del body
    const { userId, option, schedules, price } = req.body;

    // Paso 2: Validación mejorada
    if (!userId || !option || !schedules?.length || !price) {
      return res.status(400).json({
        message: "Datos incompletos: userId, option, schedules y price son requeridos"
      });
    }

    // Paso 3: Validar coincidencia de horarios
    if (schedules.length !== option) {
      return res.status(400).json({
        message: `Debe seleccionar exactamente ${option} horarios`
      });
    }

    const user = await User.findById(userId);

    // Paso 4: Nueva estructura de metadata
    const metadata = {
      user_id: userId.toString(),
      package: {
        option: Number(option),
        schedules: JSON.stringify(schedules),
        price: Number(price)
      }
    };

    // Paso 5: Configuración dinámica de URLs
    const notificationUrl = `${process.env.BACKEND_URL}/api/webhook`;

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [{
          title: `Pack de ${option} ${option === 1 ? 'clase' : 'clases'}`, // ← Nombre dinámico
          unit_price: Number(price), // ← Precio variable
          quantity: 1,
          currency_id: 'ARS'
        }],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/payment/status`, // ← URL única
          failure: `${process.env.FRONTEND_URL}/payment/status`,
          pending: `${process.env.FRONTEND_URL}/payment/status`
        },
        auto_return: 'approved',
        notification_url: notificationUrl,
        metadata // ← Nueva metadata extendida
      }
    });

    // Paso 6: Mejor respuesta con datos de debug
    res.json({
      init_point: response.init_point,
      payment_id: response.id,
    });

  } catch (error) {
    // Paso 7: Mejor manejo de errores
    console.error("Error detallado:", {
      endpoint: '/create-payment',
      userId: req.body.userId,
      error: error.response?.data || error.message
    });

    res.status(500).json({
      message: "Error al generar el pago",
      error_code: "PAYMENT_GATEWAY_ERROR",
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    // ========== [CORRECCIÓN 1] Validación de firma completa ==========
    const signatureHeader = req.headers['x-signature'];

    // Extraer correctamente la firma(puede venir en formato "ts=123,v1=abc")
    const signature = signatureHeader?.split('v1=')[1] || ''; // ← Corrección crítica
    console.log('RAW BODY HEX:', req.rawBody.toString('hex'));
    if (!signature || !verifySignature(signature, req.rawBody)) {
      console.error('❌ Firma inválida:', {
        Recibida: signature,
        Generada: crypto.createHmac('sha256', process.env.MERCADOPAGO_WEBHOOK_SECRET)
          .update(req.rawBody)
          .digest('hex'),
        RawBody: req.rawBody.toString('utf8')
      });
      return res.status(403).send("Firma no coincide"); // ← ¡Faltaba este return!
    }

    // ========== [CORRECCIÓN 2] Obtener paymentId SOLO del body ==========
    const paymentId = req.query["data.id"] // ← Nunca de query params
    if (!paymentId) {
      return res.status(400).send("ID de pago no encontrado");
    }

    // ========== [CORRECCIÓN 3] Validar tipo de evento ==========
    if (req.body?.type !== 'payment') {
      return res.status(400).json({ message: "Evento no soportado" });
    }

    // ========== [CORRECCIÓN 4] Manejo de pagos de prueba ==========
    const payment = new Payment(client);
    const result = await payment.get({ id: paymentId });

    // Validar respuesta de MP
    if (!result || result.status === 404) {
      throw new Error(`Pago ${paymentId} no existe`);
    }

    // ========== [CORRECCIÓN 5] Validación robusta de metadata ==========
    if (!result.metadata?.user_id || !result.metadata?.package) {
      console.error('Metadata inválida:', result.metadata);
      throw new Error("Estructura de metadata incorrecta");
    }

    // ========== [CORRECCIÓN 6] Parseo seguro de datos ==========
    const { user_id, package: pkg } = result.metadata;

    const parsedPackage = {
      option: Number(pkg.option),
      schedules: JSON.parse(pkg.schedules),
      price: Number(pkg.price)
    };

    // Validar números
    if (isNaN(parsedPackage.option) || isNaN(parsedPackage.price)) {
      throw new Error("Datos numéricos inválidos en metadata");
    }

    // ========== [CORRECCIÓN 7] Actualización segura del usuario ==========
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $set: {
          'subscription.active': true,
          'subscription.classesAllowed': parsedPackage.option,
          'subscription.selectedSchedules': parsedPackage.schedules,
          'subscription.expiresAt': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          'subscription.lastPayment': {
            amount: parsedPackage.price,
            date: new Date(),
            paymentId
          }
        }
      },
      { new: true, runValidators: true } // ← Validar esquema y devolver nuevo documento
    );

    if (!updatedUser) {
      throw new Error(`Usuario ${user_id} no encontrado`);
    }

    console.log(`✅ Usuario ${user_id} actualizado correctamente`);
    res.status(200).send("OK");

  } catch (error) {
    // ========== [CORRECCIÓN 8] Mejor manejo de errores ==========
    console.error("🔥 Error crítico en webhook:", {
      paymentId: req.body.data?.id,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Oculto',
      body: req.body
    });

    res.status(500).json({
      message: "Error procesando webhook",
      error_code: "WEBHOOK_PROCESSING_ERROR",
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};