var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
require('dotenv').config()

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));

// Redirect to https
if (process.env.NODE_ENV == "production") {
  app.use ((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

// Redirect from www to https
if (process.env.NODE_ENV == "production")
{
  app.use((req, res, next) => {
    console.log(req.hostname);
    next();
  })
}

// Add Routes
app.use('/', indexRouter);
//app.use('/', webRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
  res.render('error')
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  //console.log(err)

  // render the error page
  res.status(err.status || 500);
  res.render('error', { err });
});

module.exports = app;
