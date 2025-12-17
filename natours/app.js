const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//1) Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 3) Routes
//Router mounting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
