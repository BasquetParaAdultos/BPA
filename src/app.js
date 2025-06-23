import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import './cron.js';
import './subscriptionCheck.js';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/tasks.routes.js'
import adminRoutes from './routes/admin.routes.js';
import usersRoutes from './routes/users.routes.js';
import classRoutes from './routes/class.routes.js';
import paymentRoutes from "./routes/payment.routes.js";


const app = express()

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

/// Configuración de CORS mejorada
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`Solicitud recibida desde origen: ${origin}`);
    const allowedOrigins = [
      process.env.FRONTEND_URL, // URL explícita
      'http://localhost:5173'
    ];
    
    // Permitir solicitudes sin origen (Postman, apps nativas)
    if (!origin) return callback(null, true);
    
    // Verificar contra la lista blanca
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Content-Length', 'Pragma', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  // Eliminado exposedHeaders (no necesario)
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(morgan('dev'))
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  },
  type: '*/*' // ← Acepta cualquier Content-Type
}));
app.use(cookieParser())


app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", usersRoutes);
app.use("/api", classRoutes);
app.use("/api", paymentRoutes);
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});



export default app