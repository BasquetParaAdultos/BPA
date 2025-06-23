import { connectDB } from './db.js';
import './cron.js';
import './subscriptionCheck.js';
import keepAlive from './keepAlive.js';

// Conectar a MongoDB antes de iniciar los cron jobs
connectDB()
  .then(() => {
    console.log('🚀 Worker de tareas programadas iniciado!');
    keepAlive.start();
  })
  .catch((error) => {
    console.error('⛔ Fallo al iniciar worker:', error);
    process.exit(1);
  });