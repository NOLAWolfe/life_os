class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Marks as a trusted error (handled logic) vs bug

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
