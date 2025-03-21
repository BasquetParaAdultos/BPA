import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';


export const authRequired = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'No autorizado' });

        // Verifica el token y extrae los datos
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        // Busca el usuario en la base de datos
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'Usuario no existe' });

        // Adjunta el usuario a la solicitud
        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};