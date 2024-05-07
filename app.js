var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var basicAuth = require('express-basic-auth'); // Add this line
require('dotenv').config();

var indexRouter = require('./apps/index');
var mamowedaRouter = require('./apps/mamoweda')

var app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/duetv01', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// view engine setup
app.set('views', path.join(__dirname, 'apps'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add basic authentication middleware
app.use(basicAuth({
  users: {
    [process.env.USER0]: process.env.PASS0,
    [process.env.USER1]: process.env.PASS1,
   },
  challenge: true,
}));




app.use('/', indexRouter);
app.use('/apps/mamoweda', mamowedaRouter);

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
