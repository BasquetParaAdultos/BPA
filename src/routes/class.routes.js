import express from 'express';
import { 
  getClasses, 
  markAttendance ,
  updateSelectedSchedules,
  getUserAttendance
} from '../controllers/class.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/classes', authRequired, getClasses);

router.put('/classes/:classId/attendance', authRequired, markAttendance);

router.put('/schedules', authRequired, updateSelectedSchedules);

router.get('/:userId/attendance', authRequired, isAdmin, getUserAttendance);

export default router;