/**
 * file: app.js
 * date: 08/29/2022
 * description: file responsible for run the application
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const msal = require('@azure/msal-node');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

// ==> Login implementation
app.locals.users = { };

const msalConfig = {
  auth: {
    clientId: process.env.OAUTH_APP_ID,
    authority: process.env.OAUTH_AUTHORITY,
    clientSecret: process.env.OAUTH_APP_SECRET,
  },
  system: {
    loggerOption: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'secret_value_here',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
  })
);

// ==> Flash middleware (to show messages to the user)
app.use(flash());

app.use(function (req, res, next) {
  res.locals.error = req.flash('error_msg');

  const errors = req.flash('error');
  for (const i in errors) {
    res.locals.error.push({ message: 'An error occured', debug: errors[i] });
  }

  if (req.session.userId) {
    res.locals.user = app.locals.users[req.session.userId];
  }

  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
