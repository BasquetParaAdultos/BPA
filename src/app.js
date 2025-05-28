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

// Configuración de CORS mejorada
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://bpafrontend.vercel.app',
      'https://bpafrontend-git-main-basquetparaadultos-projects.vercel.app',
      'http://localhost:5173'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Content-Length', 'Pragma', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  exposedHeaders: ['Set-Cookie'],
  domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : 'localhost'
};

app.use(cors(corsOptions));

// Manejar preflight para todas las rutas
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