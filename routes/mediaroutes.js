import express from 'express';
import { home } from '../controllers/mediacontroller.js';

const router = express.Router();

router.get('/', home);

export default router;