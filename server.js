import express from 'express';
import path from 'node:path';
import session from 'express-session';


import mediaRoutes from './routes/mediaroutes.js';
import { errorHandler } from './middleware/errorhandler.js';


const app = express();
const port = 3000;

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.use('/', mediaRoutes);



app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});