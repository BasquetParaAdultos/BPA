import mongoose from 'mongoose';
import { User } from './models/user.model.js'; // Ajusta la ruta según tu estructura
import dotenv from 'dotenv';

dotenv.config();

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('⛔ Error de conexión a MongoDB:', error.message);
    process.exit(1);
  }
};

// Función principal para actualizar fechas
const updateDates = async () => {
  await connectDB();
  
  try {
    const users = await User.find({});
    let updatedCount = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      const subscription = user.subscription;
      
      // Actualizar startDate si existe
      if (subscription.startDate) {
        // Convertimos a string y luego a Date para forzar el setter
        subscription.startDate = new Date(subscription.startDate.toString());
        needsUpdate = true;
      }
      
      // Actualizar expiresAt si existe
      if (subscription.expiresAt) {
        subscription.expiresAt = new Date(subscription.expiresAt.toString());
        needsUpdate = true;
      }
      
      // Actualizar birth_date si existe
      if (user.birth_date) {
        user.birth_date = new Date(user.birth_date.toString());
        needsUpdate = true;
      }
      
      // Guardar solo si hubo cambios
      if (needsUpdate) {
        await user.save();
        updatedCount++;
        console.log(`Usuario ${user._id} actualizado`);
      }
    }
    
    console.log(`✅ ${updatedCount} usuarios actualizados`);
    process.exit(0);
  } catch (error) {
    console.error('⛔ Error durante la actualización:', error);
    process.exit(1);
  }
};

updateDates();