import express from 'express';
import { getUsers , getUserById, adminSubscription, getActiveSubscribers} from '../controllers/admin.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import {
  getPaginatedClasses
} from '../controllers/admin.controller.js';


const router = express.Router();

router.get('/users', authRequired, isAdmin, getUsers);

router.get('/classes', authRequired, isAdmin, getPaginatedClasses);

router.get('/user/:userId', authRequired, isAdmin, getUserById);

router.put('/update-subscription/:userId', authRequired, isAdmin, adminSubscription);

router.get('/active-subscribers', authRequired, isAdmin, getActiveSubscribers);

export default router;

