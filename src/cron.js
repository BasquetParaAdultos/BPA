import cron from 'node-cron';
import Class from './models/class.model.js';
import mongoose from 'mongoose';

// Función para crear las clases semanales
const createWeeklyClasses = async () => {
  try {
    const schedules = [
      "Lunes 21hs",
      "Martes 21hs",
      "Martes 22hs",
      "Jueves 20hs",
      "Jueves 21hs",
      "Viernes 21hs"
    ];

    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 días

    for (const schedule of schedules) {
      const [day, time] = schedule.split(' ');
      const hour = parseInt(time.replace('hs', ''));

      // Calcular fecha para cada horario
      const classDate = new Date(nextWeek);
      classDate.setHours(hour, 0, 0, 0);

      // Ajustar al día correspondiente
      const dayMap = {
        Lunes: 1, Martes: 2, Jueves: 4, Viernes: 5
      };
      classDate.setDate(nextWeek.getDate() + (dayMap[day] - nextWeek.getDay()));

      // Verificar si ya existe
      const existingClass = await Class.findOne({ date: classDate, schedule });
      if (!existingClass) {
        await Class.create({
          date: classDate,
          schedule,
          attendees: []
        });
      }
    }

    console.log('✅ Clases semanales creadas automáticamente');
  } catch (error) {
    console.error('❌ Error creando clases:', error);
  }
};

// Programa el Cron para ejecutarse cada domingo a las 00:00
cron.schedule('0 0 * * 0', createWeeklyClasses, {
  timezone: 'America/Argentina/Buenos_Aires'
});

// Ejecutar manualmente al iniciar el servidor (opcional)
createWeeklyClasses();