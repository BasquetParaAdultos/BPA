import cron from 'node-cron';
import User from './models/user.model.js';

const checkExpiredSubscriptions = async () => {
  const startTime = new Date();
  console.log(`[${startTime.toLocaleString('es-AR')}] 🔄 Iniciando verificación de suscripciones expiradas...`);

  try {
    const now = new Date();
    console.log(`[${now.toLocaleString('es-AR')}] 🔍 Buscando suscripciones expiradas hasta: ${now.toISOString()}`);

    const result = await User.updateMany(
      {
        'subscription.active': true,
        'subscription.expiresAt': { $lte: now }
      },
      {
        $set: {
          'subscription.active': false,
          'subscription.classesAllowed': 0,
          'subscription.selectedSchedules': []
        }
      }
    );

    const endTime = new Date();
    const duration = endTime - startTime;
    
    if (result.modifiedCount > 0) {
      console.log(`[${endTime.toLocaleString('es-AR')}] ✅ Éxito: Desactivadas ${result.modifiedCount} suscripciones (Duración: ${duration}ms)`);
    } else {
      console.log(`[${endTime.toLocaleString('es-AR')}] ⚠️  No se encontraron suscripciones para desactivar (Duración: ${duration}ms)`);
    }

  } catch (error) {
    const errorTime = new Date();
    console.error(`[${errorTime.toLocaleString('es-AR')}] 🚨 Error crítico en verificación de suscripciones:`, error);
  }
};

// Configuración con zona horaria
cron.schedule('5 0 * * *', checkExpiredSubscriptions, {
  scheduled: true,
  timezone: 'America/Argentina/Buenos_Aires'
});