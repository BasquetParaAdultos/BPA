import express from 'express';
import { getUserAttendance } from '../controllers/class.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/:userId/attendance', authRequired, isAdmin, getUserAttendance);

export default router;