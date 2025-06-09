import { connectDB } from './db.js'; 
import './cron.js'; 
import './subscriptionCheck.js'; 

// Conectar a MongoDB antes de iniciar los cron jobs
connectDB().then(() => {
  console.log('🚀 Worker de tareas programadas iniciado!');
}).catch((error) => {
  console.error('⛔ Fallo al iniciar worker:', error);
  process.exit(1);
});