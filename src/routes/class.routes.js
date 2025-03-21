import express from 'express';
import { 
  getClasses, 
  markAttendance 
} from '../controllers/class.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

router.get('/classes', authRequired, getClasses);

router.put('/classes/:classId/attendance', authRequired, markAttendance);

export default router;