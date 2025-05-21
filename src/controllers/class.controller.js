import Class from '../models/class.model.js';
import User from '../models/user.model.js'

export const getClasses = async (req, res) => {
  try {
    const userId = req.query.userId;
    let query = {};

    if (userId) {
      const user = await User.findById(userId);

      // Verificar suscripción activa y válida
      if (user?.subscription?.active && new Date(user.subscription.expiresAt) > new Date()) {
        const startDateFilter = user.subscription.startDate || new Date(0); // 1970-01-01 si no existe

        query = {
          schedule: { $in: user.subscription.selectedSchedules },
          date: {
            $gte: startDateFilter,
            $lte: user.subscription.expiresAt
          }
        };
      } else {
        return res.status(403).json([]);
      }

      console.log('Query:', JSON.stringify(query));
      console.log('User subscription:', {
        startDate: user.subscription.startDate,
        expiresAt: user.subscription.expiresAt,
        schedules: user.subscription.selectedSchedules
      });

    }


    const classes = await Class.find(query)
      .sort({ date: 1 })
      .populate('attendees.user', 'username email');

    res.status(200).json(classes);
  } catch (error) {
    console.error("Error en getClasses:", error);
    res.status(500).json([]);
  }
};

export const updateSelectedSchedules = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { selectedSchedules: req.body.schedules } },
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