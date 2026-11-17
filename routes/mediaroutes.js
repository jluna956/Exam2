import express from 'express';
import { home, browse, show } from '../controllers/mediacontroller.js';

const router = express.Router();

router.get('/', home);
router.get('/browse', browse);
router.get('/items/:id', show);

export default router;
