// runs when no route matched: creates a 404 error and passes it to the error handler
export function notFound(req, res, next) {
    const err = new Error(`Page not found: ${req.originalUrl}`);
    err.status = 404;
    next(err);
}

// error-handling middleware: four parameters, registered last in server.js
export function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    if (status >= 500) console.error(err.stack);

    res.status(status).render('error', {
        title: 'Error',
        status,
        message: status >= 500 ? 'Something went wrong on our end.' : err.message
    });
}
