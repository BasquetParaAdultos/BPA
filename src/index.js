import app from './app.js'
import { connectDB } from './db.js'
import dotenv from 'dotenv';

dotenv.config();

connectDB()
app.listen(process.env.PORT)
console.log('Servidor corriendo en el puerto 3001', process.env.PORT)