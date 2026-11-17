import express from 'express';
import { showList } from '../controllers/listcontroller.js';
import { showAdmin, createItem } from '../controllers/admincontroller.js';
import { requireLogin, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// My List: any logged-in user
router.get('/list', requireLogin, showList);

// Admin: admins only
router.get('/admin', requireAdmin, showAdmin);
router.post('/admin/items', requireAdmin, createItem);

export default router;