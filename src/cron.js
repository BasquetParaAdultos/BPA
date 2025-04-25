import cron from 'node-cron';
import Class from './models/class.model.js';
import mongoose from 'mongoose';

// Función para crear las clases semanales
const createWeeklyClasses = async () => {
  try {
    const schedules = [
      "Lunes 7hs en Meridiano V°",
      "Lunes 21hs en El Bosque",
      "Martes 21hs en El Bosque",
      "Martes 22hs en El Bosque",
      "Miercoles 7hs en Meridiano V°",
      "Jueves 19hs en Estación Norte (Femenino)",
      "Jueves 20hs en Estación Norte (Mixto)",
      "Viernes 7hs en Meridiano V°",
      "Viernes 21hs en El Bosque",
      "Sabado 9hs en El Bosque",
      "Sabado 10hs en El Bosque",
      "Sabado 11hs en El Bosque"
    ];

    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7)); // Próximo lunes
    nextMonday.setHours(0, 0, 0, 0); // Resetear hora

    for (const schedule of schedules) {
      const [day, time, location] = schedule.split(' ');
      const hour = parseInt(time.replace('hs', ''));

      const classDate = new Date(nextMonday);
      // Ajustar día según el horario
      const dayOffset = {
        Lunes: 0,
        Martes: 1,
        Miercoles: 2,
        Jueves: 3,
        Viernes: 4,
        Sabado: 5
      }[day];

      classDate.setDate(nextMonday.getDate() + dayOffset);
      classDate.setHours(hour, 0, 0, 0);

      try {
        await Class.findOneAndUpdate(
          { date: classDate, schedule },
          { $setOnInsert: { attendees: [] } },
          {
            upsert: true,
            new: true,
            useFindAndModify: false
          }
        );
      } catch (error) {
        console.error(`Error procesando ${schedule}:`, error.message);
      }
    }

    console.log('✅ Clases actualizadas correctamente');
  } catch (error) {
    console.error('❌ Error general:', error);
  }
};

// Programa el Cron para ejecutarse cada domingo a las 00:00
cron.schedule('0 0 * * 0', createWeeklyClasses, {
  timezone: 'America/Argentina/Buenos_Aires'
});

// Ejecutar manualmente al iniciar el servidor (opcional)
createWeeklyClasses();