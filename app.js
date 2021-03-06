const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const setSwig = require('./src/config/swigConfig');
const indexRouter = require('./src/routes/index');
const test = require('./src/routes/test');
const dubbo = require('./src/config/dubboConfig');
const app = express();

/**
 * 异步异常捕获,防止应用崩溃
 */
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});
setSwig.setSwig(app);
app.use(dubbo.getDubboService());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/test', test);


// catch 40     4 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
