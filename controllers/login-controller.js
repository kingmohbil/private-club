const passport = require('passport');
const { body, validationResult } = require('express-validator');
const authenticationMiddleware = require('../middleware/authentication');
exports.getLogin = [
  authenticationMiddleware.notAuthenticated,
  (req, res) => {
    return res.render('login');
  },
];

exports.postLogin = [
  body('email', '* Must be a valid email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('* Password at least must be 8 characters long')
    .isLength({ max: 20 })
    .withMessage('* Password at most can be 20 characters long')
    .escape(),
  (req, res, next) => {
    const isValid = validationResult(req);
    if (!isValid.isEmpty()) {
      return res.render('login', {
        errors: isValid.array(),
        email: req.body.email,
        password: req.body.password,
      });
    }
    next();
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }),
];
