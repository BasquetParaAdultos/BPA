import express from 'express';
import { 
  getClasses, 
  markAttendance ,
  updateSelectedSchedules
} from '../controllers/class.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

router.get('/classes', authRequired, getClasses);

router.put('/classes/:classId/attendance', authRequired, markAttendance);

router.put('/schedules', authRequired, updateSelectedSchedules);

export default router;