import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccesToken } from '../libs/jwt.js'
import jwt from 'jsonwebtoken'


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

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Usa true en producción (HTTPS)
            sameSite: 'lax'
        });
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
    const { email, password } = req.body

    try {

        const userFound = await User.findOne({ email })
        if (!userFound) return res.status(400).json({ message: 'Usuario no encontrado' })

        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' })

        // Genera el token con el campo 'role'
        const token = jwt.sign(
            {
                id: userFound._id,
                role: userFound.role
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Cambia a true en producción (HTTPS)
            sameSite: "lax",
            maxAge: 3600000,
        })
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role,
            payment_status: userFound.payment_status, // <- ¡Campo crítico!
            subscription_date: userFound.subscription_date,
            expiration_date: userFound.expiration_date,
            phone: userFound.phone,
            full_name: userFound.full_name,
            description: userFound.description,
            profile_picture: userFound.profile_picture
        })
    } catch (error) {
        console.log(error)
    }
};

export const logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0)
    })
    return res.status(200).json({ message: 'Sesion cerrada correctamente' })
}

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

    if (!token) return res.status(401).json({ message: 'No autorizado' });

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });

        try {
            const userFound = await User.findById(decoded.id)
                .select('-password')
                .lean();

            if (!userFound) return res.status(404).json({ message: 'Usuario no encontrado' });

            res.json({
                ...userFound,
                id: userFound._id
            });

        } catch (error) {
            console.error("Error en verifyToken:", error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    });
};

export const updateProfile = async (req, res) => {
    try {
        const { phone, full_name, description, profile_picture } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                phone,
                full_name,
                description,
                profile_picture
            },
            { new: true, select: '-password' }
        );

        res.json(updatedUser);
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(500).json({ message: "Error al actualizar el perfil" });
    }
};