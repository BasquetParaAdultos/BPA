// keepAlive.js
import cron from 'node-cron';
import axios from 'axios';
import 'dotenv/config';

// Obtener la URL base del backend desde las variables de entorno
const BACKEND_BASE_URL = process.env.BACKEND_URL 
const HEALTH_ENDPOINT = '/health';

// Construir la URL completa
const HEALTH_CHECK_URL = `${BACKEND_BASE_URL}${HEALTH_ENDPOINT}`;

const keepAlive = cron.schedule('*/5 * * * *', async () => {
  try {
    if (!BACKEND_BASE_URL) {
      throw new Error("BACKEND_URL no está definida en las variables de entorno");
    }
    
    console.log('🔥 Enviando keep-alive a:', HEALTH_CHECK_URL);
    const response = await axios.get(HEALTH_CHECK_URL);
    console.log(`✅ Backend activo: ${response.data.timestamp}`);
  } catch (error) {
    console.error('⛔ Error al activar backend:', error.message);
  }
});

export default keepAlive;