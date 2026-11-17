import {registerUser, loginUser} from '../services/userservice.js';


// renders the login page with defaults for every variable the view uses
function renderLogin(res, status, extras = {}) {
    res.status(status).render('login', {
        title: 'Log in',
        active: 'login',
        loginError:null,
        registerError:null,
        values:{},
        ...extras
    });
}

export function showLogin(req, res, next) {
    try {
        if (req.session.user) return res.redirect('/'); // already logged in
        renderLogin(res, 200, { loginError: req.query.error || null });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const user = await loginUser(req.body || {});
        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.redirect('/');
    } catch (err) {
        
        if (err.status && err.status < 500) {
            return renderLogin(res, err.status, {
                loginError: err.message,
                values: { loginEmail: req.body?.email }
            });
        }
        next(err);
    }
}

export async function register(req, res, next) {
    try {
        const user = await registerUser(req.body || {});
        req.session.user = { id: user.id, username: user.username, role: user.role }; // log in right away
        res.redirect('/');
    } catch (err) {
        if (err.status && err.status < 500) {
            return renderLogin(res, err.status, {
                registerError: err.message,
                values: { username: req.body?.username, email: req.body?.email }
            });
        }
        next(err);
    }
}

export function logout(req, res, next) {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid'); // the session cookie's default name
        res.redirect('/');
    });
}
