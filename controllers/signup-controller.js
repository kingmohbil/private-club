const debug = require('debug')('debug');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const authenticationMiddleware = require('../middleware/authentication');
const users = require('../models/users-model');
exports.getSignup = [
  authenticationMiddleware.notAuthenticated,
  (req, res) => {
    return res.render('signup');
  },
];

exports.createUser = [
  body('firstName', '* First Name can`t be empty')
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 20 })
    .withMessage('* First Name can not exceed 20 Characters')
    .escape(),
  body('lastName', '* Last Name can`t be empty')
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 20 })
    .withMessage('* Last Name can not exceed 20 Characters')
    .escape(),
  body('email', '* Email must be a valid email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .escape(),
  body('email').custom(async (email) => {
    const exist = await users.exists({ email });
    if (exist) {
      debug(`* User ${email} already exists`);
      throw new Error(`* User ${email} already exists`);
    } else return true;
  }),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('* Password must be at least 8 Characters long')
    .isLength({ max: 20 })
    .withMessage('* Password must be at most 20 Characters long')
    .escape(),
  (req, res) => {
    debug('Validating data from user...');
    const isValid = validationResult(req, res);
    if (!isValid.isEmpty()) {
      debug('Validation Result in error');
      return res.render('signup', {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        errors: isValid.array(),
      });
    } else {
      debug('User Data was validated successfully');
      try {
        debug('hashing password...');
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          users.create(
            {
              first_name: req.body.firstName,
              last_name: req.body.lastName,
              email: req.body.email,
              password: hashedPassword,
            },
            (err) => {
              if (err) throw err;
              debug('user created successfully');
            }
          );
        });
        return res.redirect('/login');
      } catch (err) {
        debug(err.message);
        return res.redirect('/signup');
      }
    }
  },
];
