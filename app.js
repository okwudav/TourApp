const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
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

// MIDDLEWARE to check ALL(*) routes that wr not executes above b4 reaching here
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ERROR MIDDLEWAEW to catch all error
app.use(globalErrorHandler);

module.exports = app;