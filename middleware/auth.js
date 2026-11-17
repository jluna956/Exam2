// only logged-in users can continue; everyone else goes to the login page
export function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login?error=' + encodeURIComponent('Please log in first.'));
    }
    next();
}

// only admins can continue; logged-in non-admins get a 403
export function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login?error=' + encodeURIComponent('Please log in first.'));
    }
    if (req.session.user.role !== 'admin') {
        const err = new Error('Admins only. You do not have access to this page.');
        err.status = 403;
        return next(err);
    }
    next();
}
