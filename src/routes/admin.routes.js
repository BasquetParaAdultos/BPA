import express from 'express';
import { getUsers } from '../controllers/admin.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import {
  getPaginatedClasses
} from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/users', authRequired, isAdmin, getUsers);

router.get('/classes', authRequired, isAdmin, getPaginatedClasses);

export default router;

