import Class from '../models/class.model.js';

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .sort({ date: 1 })
      .populate('attendees.user', 'username email');
    res.status(200).json(classes);;
  } catch (error) {
    res.status(500).json([]);
  }
};

// class.controller.js
export const markAttendance = async (req, res) => {
  try {
    const classId = req.params.classId;
    const userId = req.user.id;
    const attended = req.body.attended;

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