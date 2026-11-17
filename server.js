import express from 'express';
import path from 'node:path';
import session from 'express-session';


import mediaRoutes from './routes/mediaroutes.js';
import { notFound, errorHandler } from './middleware/errorhandler.js';


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'dev-only-secret-change-me',
    resave: false,
    saveUninitialized: false,
}));

// makes the logged-in user available to every view (used by the header)
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    res.locals.active = '';
    next();
});

app.use('/', mediaRoutes);

// error handling: always last
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
