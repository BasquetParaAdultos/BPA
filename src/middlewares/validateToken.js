import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authRequired = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        // 1. Verificar si existe el token
        if (!token) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        // 2. Verificar y decodificar el token
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                // 3. Limpiar cookie inválida
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined,
                    path: '/'
                });
                
                return res.status(401).json({ 
                    message: 'Token inválido o expirado' 
                });
            }

            try {
                // 4. Buscar usuario en la base de datos
                const user = await User.findById(decoded.id).select('-password');
                if (!user) {
                    return res.status(404).json({ message: 'Usuario no existe' });
                }

                // 5. Adjuntar usuario a la solicitud
                req.user = user;
                next();
            } catch (dbError) {
                console.error('Error en base de datos:', dbError);
                res.status(500).json({ message: 'Error interno del servidor' });
            }
        });
    } catch (error) {
        console.error('Error general en authRequired:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};