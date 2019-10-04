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


module.exports = app;