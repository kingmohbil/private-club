require('dotenv').config();
const debug = require('debug')('debug');
const passport = require('passport');
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const connect = require('./connection');
const signupRoute = require('./routes/signup-route');
const loginRoute = require('./routes/login-route');
const homeRoute = require('./routes/home-route');
const app = express();
initializePassport(passport);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/', homeRoute);

app.listen(process.env.PORT, () =>
  debug(`server listening on port ${process.env.PORT}...`)
);

connect();
