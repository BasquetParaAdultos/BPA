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

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control', // Añadir este header
    'Content-Length', // Añadir para manejar preflight
    'Pragma'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Añadir OPTIONS
}));
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