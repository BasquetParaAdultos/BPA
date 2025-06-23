import Class from '../models/class.model.js';
import User from '../models/user.model.js'
import { horariosbpa } from "../config/schedules.js";


export const getClasses = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    // Lógica para USUARIOS NORMALES
    if (!req.user.isAdmin) {
      const user = await User.findById(req.user.id);
      
      // Validar que la suscripción esté activa y tenga fechas definidas
      if (!user?.subscription?.active || 
          !user.subscription.startDate ||
          !user.subscription.expiresAt) {
        return res.status(403).json([]);
      }

      // Filtro por horarios y rango completo de la suscripción
      const classes = await Class.find({
        schedule: { $in: user.subscription.selectedSchedules },
        date: { 
          $gte: new Date(user.subscription.startDate),
          $lte: new Date(user.subscription.expiresAt)
        }
      })
      .sort({ date: 1 })  // Ordenar por fecha ascendente
      .populate('attendees.user', 'username email');

      return res.status(200).json(classes);
    }

    // Lógica para ADMINISTRADORES (manteniendo tu implementación original)
    const currentDate = new Date();
      
    // 1. Calcular semana actual (DOMINGO a SÁBADO)
    const getCurrentWeekRange = () => {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay());
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      
      return { start, end };
    };

    // 2. Calcular semana objetivo según paginación
    const { start: currentWeekStart, end: currentWeekEnd } = getCurrentWeekRange();
    const weeksAgo = (parseInt(page) - 1);
    const targetWeekStart = new Date(currentWeekStart);
    targetWeekStart.setDate(currentWeekStart.getDate() - (7 * weeksAgo));
    
    const targetWeekEnd = new Date(targetWeekStart);
    targetWeekEnd.setDate(targetWeekStart.getDate() + 6);
    targetWeekEnd.setHours(23, 59, 59, 999);

    // 3. Obtener SOLO clases pasadas o de la semana en curso
    const classes = await Class.find({
      date: { 
        $gte: targetWeekStart,
        $lte: Math.min(targetWeekEnd, currentWeekEnd)
      }
    }).populate('attendees.user', 'username email');

    // 4. Calcular total de páginas REALES (solo hasta semana actual)
    const earliestClass = await Class.findOne().sort({ date: 1 });
    const totalWeeks = earliestClass 
      ? Math.ceil(
          (currentWeekStart - earliestClass.date) / 
          (7 * 24 * 60 * 60 * 1000)
        ) + 1
      : 1;

    // 5. Ordenar clases según horariosbpa
    const scheduleOrder = horariosbpa.reduce((acc, item, index) => 
      ({ ...acc, [item]: index }), {});

    const sortedClasses = classes.sort((a, b) => 
      scheduleOrder[a.schedule] - scheduleOrder[b.schedule]
    );

    return res.status(200).json({
      classes: sortedClasses,
      totalPages: Math.max(1, totalWeeks),
      currentWeek: {
        start: targetWeekStart.toLocaleDateString('es-AR'),
        end: targetWeekEnd.toLocaleDateString('es-AR')
      }
    });

  } catch (error) {
    console.error("Error en getClasses:", error);
    res.status(500).json(req.user.isAdmin ? { error: error.message } : []);
  }
};

export const updateSelectedSchedules = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          "subscription.selectedSchedules": req.body.schedules
        }
      },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// class.controller.js
export const markAttendance = async (req, res) => {
  try {
    const classId = req.params.classId;
    const userId = req.user.id;
    const attended = req.body.attended;

    // Verificar si la clase es futura
    const classDoc = await Class.findById(classId);
    if (new Date(classDoc.date) > new Date()) {
      return res.status(400).json({ message: "No se puede marcar asistencia para clases futuras" });
    }

    // Buscar si ya existe una entrada para el usuario
    const existingAttendance = await Class.findOne({
      _id: classId,
      "attendees.user": userId
    });

    let updatedClass;
    if (existingAttendance) {
      // Actualizar asistencia existente
      updatedClass = await Class.findOneAndUpdate(
        {
          _id: classId,
          "attendees.user": userId
        },
        { $set: { "attendees.$.attended": attended } },
        { new: true }
      ).populate('attendees.user', 'username email');
    } else {
      // Crear nueva entrada de asistencia
      updatedClass = await Class.findByIdAndUpdate(
        classId,
        { $push: { attendees: { user: userId, attended } } },
        { new: true }
      ).populate('attendees.user', 'username email');
    }

    if (!updatedClass) {
      return res.status(404).json({ message: "Clase no encontrada" });
    }

    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAttendance = async (req, res) => {
  try {
    const userId = req.params.userId;

    const classes = await Class.find({
      "attendees.user": userId,
      date: { $lte: new Date() } // Solo clases pasadas
    })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const attendance = classes.map(classDoc => {
      const attendee = classDoc.attendees.find(a => a.user.toString() === userId);
      return attendee?.attended; // Usamos optional chaining
    });

    // Completar con null si hay menos de 5 clases
    while (attendance.length < 5) attendance.push(null);

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};