// Server Modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var userInViews = require('./middleware/userInViews');
var secured = require('./middleware/secured');
require('dotenv').config();

// Load routers
var slackRouter = require('./routes/slack_routes');
var indexRouter = require('./routes/index');
var webRouter = require('./routes/web_routes');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');

// Load Passport - persistent sessions
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
const interaction_handler = require('./interaction_handler');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

// Use created strategy
passport.use(strategy);

// Lighten Payload
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Create App object
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));

// config express-session
var sess = {
  secret: process.env.RANDOM_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};

// Check if on production
if (process.env.NODE_ENV == "production") {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;

  // Redirect to https
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

// Create Session
app.use(session(sess))

// Add Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Add Session Middleware
app.use(flash());

// Handle auth failure error messages
app.use(function (req, res, next) {
  if (req && req.query && req.query.error) {
    req.flash('error', req.query.error);
  }
  if (req && req.query && req.query.error_description) {
    req.flash('error_description', req.query.error_description);
  }
  next();
});

app.use(userInViews());

// Add User Info Middleware
app.use(function (req, res, next) {
  if (req.user) {
    const { _raw, _json, ...userProfile } = req.user;

    //TODO Find out a better way to do this... 
    //global variables for logins is a bad idea but it work for now until I have the console built out
    global.profile = userProfile;

    //TODO Optimize Database Interaction
    interaction_handler.setUserRoles(userProfile);
  }
  next();
});

// Add Routes
app.use('/', authRouter);
app.use('/', usersRouter);
app.use('/', indexRouter);
//app.use('/', webRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// No stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
