<<<<<<< HEAD
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var picturesRouter = require('./routes/pictures');
var albumsRouter = require('./routes/albums');
=======
const logger = require('morgan');

>>>>>>> filtering

var config = require('./config');

var app = express();


const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.databaseUrl);



// Don't forget to set JWT key
app.set('secretKey', 'mylittlesecret');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
<<<<<<< HEAD
app.use('/pictures', picturesRouter);
app.use('/albums', albumsRouter);
=======
app.use('/albums', albumsRouter);
app.use('/pictures', picturesRouter);
>>>>>>> filtering

// catch 404 and forward to error handler
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

