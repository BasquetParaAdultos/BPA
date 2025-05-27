import cron from 'node-cron';
import Class from './models/class.model.js'; 
import { horariosbpa } from './config/schedules.js';

const generateClasses = async () => {
  const startTime = new Date();
  console.log(`[${startTime.toLocaleString('es-AR')}] 🔄 Iniciando generación de clases...`);

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);

    console.log(`[${new Date().toLocaleString('es-AR')}] 📅 Rango de fechas: ${today.toISOString()} - ${endDate.toISOString()}`);

    // Búsqueda de clases existentes
    const existingClasses = await Class.find({
      date: { $gte: today, $lte: endDate }
    }).lean();

    console.log(`[${new Date().toLocaleString('es-AR')}] 🔍 ${existingClasses.length} clases existentes encontradas`);

    const existingClassesMap = new Set(
      existingClasses.map(c => `${c.date.toISOString()}|${c.schedule}`)
    );

    const classesToCreate = [];
    const daysMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Generación de clases
    for (let day = 0; day <= 30; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);
      currentDate.setHours(0, 0, 0, 0);

      const dayName = daysMap[currentDate.getDay()];
      const dailySchedules = horariosbpa.filter(schedule => 
        schedule.startsWith(dayName)
      );

      // Registro detallado por día
      console.log(`[${new Date().toLocaleString('es-AR')}] 📆 Procesando ${dayName} ${currentDate.toISOString()}: ${dailySchedules.length} horarios disponibles`);

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

    // Inserción de clases
    if (classesToCreate.length > 0) {
      await Class.insertMany(classesToCreate);
      console.log(`[${new Date().toLocaleString('es-AR')}] 🎉 ${classesToCreate.length} clases creadas exitosamente`);
    } else {
      console.log(`[${new Date().toLocaleString('es-AR')}] ⚠️  No se requirieron nuevas clases`);
    }

  } catch (error) {
    const errorTime = new Date();
    console.error(`[${errorTime.toLocaleString('es-AR')}] 🚨 Error en generación de clases:`, error);
  } finally {
    const endTime = new Date();
    const duration = endTime - startTime;
    console.log(`[${endTime.toLocaleString('es-AR')}] ⏳ Proceso completado en ${duration}ms`);
  }
};

// Configuración con zona horaria
cron.schedule('0 0 * * *', generateClasses, {
  scheduled: true,
  timezone: 'America/Argentina/Buenos_Aires'
});