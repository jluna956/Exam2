import express from 'express';
import { home, browse, show } from '../controllers/mediacontroller.js';
import { createReview } from '../controllers/reviewcontroller.js';
import { savetoList } from '../controllers/listcontroller.js';
import { requireLogin } from '../middleware/auth.js';


const router = express.Router();

router.get('/', home);
router.get('/browse', browse);
router.get('/items/:id', show);

// forms on the item page: only logged-in users can post
router.post('/items/:id/reviews', requireLogin, createReview);
router.post('/items/:id/list', requireLogin, savetoList);

export default router;
