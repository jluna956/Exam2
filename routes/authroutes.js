import express from "express";
import { showLogin, login, register, logout } from '../controllers/authcontroller.js';
import { requireLogin } from '../middleware/auth.js';

const router = express.Router();

router.get('/login', showLogin);
router.post('/login', login);
router.get('/register', (req, res) => {
    res.redirect('/login'); // both forms live on /login
});
router.post('/register', register);
router.post('/logout', requireLogin, logout);

export default router;
