import User from '../models/user.model.js';
import Class from '../models/class.model.js';

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