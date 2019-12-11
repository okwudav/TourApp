const AppError = require('./../utils/AppError');

const handleCastErrorDb = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 500);
}

const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}

const sendErrorProd = (res, err) => {
    // Operational, truested errors: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // Program or other unknown error: don't leak error details
    else {
        // log the error
        console.log('ERROR => ', err);

        // send generic message
        res.status(500).json({
            status: err.status,
            message: 'Opps... Something went wrong!'
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(res, err);
    } else if (process.env.NODE_ENV === 'production') {
        // destructuring the err variable
        let error = { ...err };

        if (error.name === 'CastError') error = handleCastErrorDb(error);

        sendErrorProd(res, error);
    }
}