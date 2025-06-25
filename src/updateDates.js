import mongoose from 'mongoose';
import { User } from './models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('⛔ Error de conexión:', error.message);
    process.exit(1);
  }
};

// Función principal
const migrateDates = async () => {
  await connectDB();
  
  // Verificar si ya se ejecutó
  const MIGRATION_KEY = 'date_migration_v1';
  const systemUser = await User.findOne({ username: 'system' });
  
  if (systemUser?.migrations?.includes(MIGRATION_KEY)) {
    console.log('⚠️ Migración ya completada. Saliendo.');
    return;
  }

  try {
    const users = await User.find({
      $or: [
        { 'subscription.startDate': { $exists: true } },
        { 'subscription.expiresAt': { $exists: true } },
        { 'birth_date': { $exists: true } }
      ]
    });
    
    console.log(`🔁 Migrando ${users.length} usuarios...`);
    
    for (const user of users) {
      // Solo modifica si es necesario
      const update = {};
      
      if (user.subscription.startDate) {
        update['subscription.startDate'] = new Date(user.subscription.startDate);
      }
      
      if (user.subscription.expiresAt) {
        update['subscription.expiresAt'] = new Date(user.subscription.expiresAt);
      }
      
      if (user.birth_date) {
        update['birth_date'] = new Date(user.birth_date);
      }
      
      if (Object.keys(update).length > 0) {
        await User.updateOne({ _id: user._id }, { $set: update });
      }
    }
    
    // Marcar como completado
    await User.updateOne(
      { username: 'system' },
      { 
        $setOnInsert: { username: 'system', role: 'system' },
        $addToSet: { migrations: MIGRATION_KEY } 
      },
      { upsert: true }
    );
    
    console.log('✅ Migración completada exitosamente');
  } catch (error) {
    console.error('⛔ Error en migración:', error);
    process.exit(1);
  } finally {
    mongoose.disconnect();
  }
};

migrateDates();