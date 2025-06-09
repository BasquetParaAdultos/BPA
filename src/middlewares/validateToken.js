import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// validateToken.js
export const authRequired = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        // ✅ Verificación síncrona (no necesita async)
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        
        // ✅ Buscar usuario
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            // Limpiar cookie inválida
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/'
            });
            return res.status(404).json({ message: 'Usuario no existe' });
        }

        req.user = user;
        next();
    } catch (error) {
        // ✅ Manejar diferentes tipos de errores
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/'
            });
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        
        console.error('Error en authRequired:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};