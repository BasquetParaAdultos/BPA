import User from '../models/user.model.js';
import Class from '../models/class.model.js';
import mongoose from 'mongoose';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Excluye la contraseña
    res.json(users);
  } catch (error) {
    console.error("Error en getUsers:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getPaginatedClasses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const classes = await Class.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'attendees.user',
        select: 'username email'
      });

    const total = await Class.countDocuments();

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      classes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    // Verificar ID válido
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const user = await User.findById(req.params.userId)
      .select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Formatear manualmente las fechas
    const formattedUser = {
      ...user._doc,
      birth_date: user.birth_date ? user.birth_date.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };

    res.json(formattedUser);
  } catch (error) {
    console.error('Error en getUserById:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};


export const adminSubscription = async (req, res) => {
    try {
        const { subscription } = req.body;
        const updateObj = {};

        // 1. Validar y actualizar solo los campos recibidos
        if (subscription.active !== undefined) {
            updateObj['subscription.active'] = subscription.active;
        }

        if (subscription.classesAllowed !== undefined) {
            if (!Number.isInteger(subscription.classesAllowed) || subscription.classesAllowed < 0 || subscription.classesAllowed > 4) {
                return res.status(400).json({ error: 'Cantidad de clases inválida (0-4)' });
            }
            updateObj['subscription.classesAllowed'] = subscription.classesAllowed;
        }

        if (subscription.selectedSchedules !== undefined) {
            if (!Array.isArray(subscription.selectedSchedules)) {
                return res.status(400).json({ error: 'Formato de horarios inválido' });
            }
            updateObj['subscription.selectedSchedules'] = subscription.selectedSchedules;
        }

        if (subscription.startDate !== undefined) {
            const startDate = new Date(subscription.startDate);
            if (isNaN(startDate.getTime())) {
                return res.status(400).json({ error: 'Fecha de inicio inválida' });
            }
            updateObj['subscription.startDate'] = startDate;
        }

        if (subscription.expiresAt !== undefined) {
            const expiresAt = new Date(subscription.expiresAt);
            if (isNaN(expiresAt.getTime())) {
                return res.status(400).json({ error: 'Fecha de expiración inválida' });
            }
            updateObj['subscription.expiresAt'] = expiresAt;
        }

        // 2. Actualizar manteniendo datos existentes
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updateObj }, // Solo modifica los campos especificados
            {
                new: true,
                runValidators: true,
                select: '-password'
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error('Error en adminSubscription:', error);
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({ 
            error: 'Error actualizando suscripción',
            details: error.message 
        });
    }
}

export const getActiveSubscribers = async (req, res) => {
    try {
        const users = await User.find({ 
            'subscription.active': true 
        }).select('username full_name dni birth_date subscription.expiresAt'); // Añadir username
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};