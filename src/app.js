import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import './cron.js';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/tasks.routes.js'
import adminRoutes from './routes/admin.routes.js';
import classRoutes from './routes/class.routes.js';
import paymentRoutes from "./routes/payment.routes.js";


const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())


app.use("/api" ,authRoutes)
app.use("/api", taskRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api", classRoutes);
app.use("/api", paymentRoutes);


export default app