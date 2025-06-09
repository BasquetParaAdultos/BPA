import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccesToken } from '../libs/jwt.js'
import jwt from 'jsonwebtoken'


const setAuthCookie = (res, token) => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // ✅ Configuración corregida para producción
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        domain: isProduction ? '.bpa-ftmu.onrender.com' : undefined,
        path: '/'
    });
};


export const register = async (req, res) => {
    const { username, email, password } = req.body

    try {

        const userFound = await User.findOne({ email })
        if (userFound) return res.status(400).json(['El correo ya esta en uso'])


        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            email,
            password: passwordHash
        })

        const userSaved = await newUser.save()
        const token = await createAccesToken({ id: userSaved._id })

        setAuthCookie(res, token);
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            udatedAt: userSaved.updatedAt
        })
    } catch (error) {
        console.log(error)
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json({ message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

        // Generar token con datos actualizados
        const tokenPayload = {
            id: userFound._id,
            role: userFound.role,
            subscriptionActive: userFound.subscription.active // Agregar estado de suscripción al payload
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.TOKEN_SECRET,
            { expiresIn: "1h" }
        );

       setAuthCookie(res, token);

        // Respuesta actualizada con nueva estructura de suscripción
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role,
            phone: userFound.phone,
            full_name: userFound.full_name,
            description: userFound.description,
            profile_picture: userFound.profile_picture,
            subscription: {
                active: userFound.subscription.active,
                classesAllowed: userFound.subscription.classesAllowed,
                selectedSchedules: userFound.subscription.selectedSchedules,
                expiresAt: userFound.subscription.expiresAt,
                lastPayment: userFound.subscription.lastPayment
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
        domain: process.env.NODE_ENV === 'production' ? '.bpa-ftmu.onrender.com' : undefined,
        path: '/'
    });
    res.status(200).json({ message: 'Sesión cerrada' });
};

export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id)
            .select('-password') // Excluir la contraseña
            .lean();

        if (!userFound) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Devuelve todos los campos necesarios
        res.json({
            ...userFound, // Devuelve todos los campos directamente
            id: userFound._id
        });

    } catch (error) {
        console.error("Error en profile:", error);
        res.status(500).json({ message: "Error al obtener el perfil" });
    }
};

export const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    // Si no hay token, responder con usuario vacío
    if (!token) {
        return res.status(200).json({
            authenticated: false, // Nuevo campo clave
            user: null
        });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(200).json({
                authenticated: false, // Nuevo campo clave
                message: 'Token inválido',
                user: null
            });
        }

        try {
            const userFound = await User.findById(decoded.id)
                .select('-password')
                .lean();

            if (!userFound) return res.status(404).json({ 
                authenticated: false, // Nuevo campo clave
                message: 'Usuario no encontrado',
                user: null
             });

            // Asegurar que la suscripción siempre tenga una estructura válida
            const safeSubscription = userFound.subscription || {
                active: false,
                classesAllowed: 0,
                selectedSchedules: [],
                expiresAt: null,
                lastPayment: null
            };

            // Estructura de respuesta actualizada
            const response = {
                ...userFound,
                id: userFound._id,
                subscription: {
                    active: safeSubscription.active,
                    classesAllowed: safeSubscription.classesAllowed,
                    selectedSchedules: safeSubscription.selectedSchedules || [],
                    expiresAt: safeSubscription.expiresAt,
                    lastPayment: safeSubscription.lastPayment
                }
            };

            res.json({
                authenticated: true, // Nuevo campo clave
                user: response
            });

        } catch (error) {
            console.error("Error en verifyToken:", error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    });
};

export const updateProfile = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);
        
        // Convertir campos especiales
        const updateData = {
            ...req.body,
            birth_date: req.body.birth_date ? new Date(req.body.birth_date) : null,
            chronic_diseases: req.body.chronic_diseases === 'true' || req.body.chronic_diseases === true
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        console.error('Error de actualización:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

