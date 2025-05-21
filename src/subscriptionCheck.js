import cron from 'node-cron';
import mongoose from 'mongoose';
import User from './models/user.model.js';

const checkExpiredSubscriptions = async () => {
  try {
    const now = new Date();
    
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

    if (result.modifiedCount > 0) {
      console.log(`Desactivadas ${result.modifiedCount} suscripciones expiradas`);
    }
  } catch (error) {
    console.error('Error verificando suscripciones:', error);
  }
};

// Ejecutar diariamente a las 00:05
cron.schedule('5 0 * * *', () => {
  console.log('Iniciando verificación de suscripciones...');
  checkExpiredSubscriptions();
});

// Ejecutar al iniciar el servidor
checkExpiredSubscriptions();