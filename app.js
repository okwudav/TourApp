const express = require('express');
const morgan = require('morgan');

const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// ROUTES
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

// MIDDLEWARE to check routes that wr not executes above b4 reaching here
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'failed',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // });
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    err.status = 'failed';

    next(err);
});

// ERROR MIDDLEWAEW 
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });

    next();
});

module.exports = app;