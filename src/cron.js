import cron from 'node-cron';
import mongoose from 'mongoose';
import Class from './models/class.model.js'; 
import { horariosbpa } from './config/schedules.js';

// Función para crear clases
const generateClasses = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar fecha a medianoche
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);

    // Obtener todas las clases existentes en el rango
    const existingClasses = await Class.find({
      date: { $gte: today, $lte: endDate }
    }).lean();

    // Crear un Set de identificadores únicos (fecha + horario)
    const existingClassesMap = new Set(
      existingClasses.map(c => `${c.date.toISOString()}|${c.schedule}`)
    );

    // Generar todas las clases potenciales
    const classesToCreate = [];
    
    // Mapeo de días en español
    const daysMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    for (let day = 0; day <= 30; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);
      currentDate.setHours(0, 0, 0, 0); // Fecha sin hora

      const dayName = daysMap[currentDate.getDay()];
      
      // Filtrar horarios del día
      const dailySchedules = horariosbpa.filter(schedule => 
        schedule.startsWith(dayName)
      );

      for (const schedule of dailySchedules) {
        const uniqueKey = `${currentDate.toISOString()}|${schedule}`;
        
        if (!existingClassesMap.has(uniqueKey)) {
          const [_, time, ...locationParts] = schedule.split(' ');
          const location = locationParts.join(' ');

          classesToCreate.push({
            date: currentDate,
            schedule,
            time,
            location,
            availableSlots: 10,
            registeredUsers: []
          });
        }
      }
    }

    // Insertar en lote solo las nuevas clases
    if (classesToCreate.length > 0) {
      await Class.insertMany(classesToCreate);
      console.log(`Creadas ${classesToCreate.length} nuevas clases`);
    } else {
      console.log('No se necesitan nuevas clases');
    }

  } catch (error) {
    console.error('Error generando clases:', error);
  }
};


// Configurar el cron job para ejecutar diariamente a la medianoche
cron.schedule('0 0 * * *', () => {
  console.log('Iniciando generación de clases...');
  generateClasses();
});

// Ejecutar inmediatamente al iniciar el servidor (opcional)
generateClasses();