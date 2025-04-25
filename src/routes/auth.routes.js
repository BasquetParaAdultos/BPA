import { Router } from 'express'
import { register, login, logout, profile, verifyToken, updateProfile, getUserById } from '../controllers/auth.controllers.js'
import { isAdmin } from '../middlewares/isAdmin.js';
import { authRequired } from '../middlewares/validateToken.js'
import { validatorSchema } from '../middlewares/validator.middleware.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'


const router = Router()

router.post('/register',validatorSchema(registerSchema), register);

router.post('/login',validatorSchema(loginSchema), login);

router.post('/logout', logout)

router.get('/verify', verifyToken )

router.get('/profile', authRequired, profile);

router.get('/profile/:userId', authRequired, isAdmin, getUserById, profile);

router.put('/update', authRequired, updateProfile);

export default router; 