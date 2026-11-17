// creates an Error that carries an HTTP status code (400, 401, 404, 409, ...)
export function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}
