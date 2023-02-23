require('dotenv').config();
const debug = require('debug')('controllers');
const users = require('../models/users-model');
const authenticationMiddleware = require('../middleware/authentication');
const vip = require('../middleware/vip');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

exports.getVipForm = [
  authenticationMiddleware.authenticated,
  vip.isVip,
  (req, res) => {
    return res.render('vip');
  },
];

exports.registerVip = [
  body('password', '* It must be at least 8 characters long')
    .trim()
    .isLength({ min: 8 })
    .isLength({ max: 20 })
    .withMessage('* Password must be at most 20 characters long'),
  async (req, res) => {
    const isValid = validationResult(req);
    debug('Validating the vip password');
    if (!isValid.isEmpty()) {
      debug('Errors happened when validating the vip password');
      return res.render('vip', {
        errors: isValid.array(),
        password: req.body.password,
      });
    }
    bcrypt.compare(
      req.body.password,
      process.env.SECRET_VIP_PASSWORD,
      async (err, success) => {
        if (err) {
          debug(err.message);
          return res.render('vip', {
            errors: [{ msg: 'Please try again later unknown error happened' }],
            password: req.body.password,
          });
        }
        if (!success) {
          debug('passwords does not match');
          return res.render('vip', {
            errors: [{ msg: 'Passwords does not match' }],
            password: req.body.password,
          });
        }
        debug('passwords matches registering VIP users');
        try {
          const result = await users.findOneAndUpdate(
            {
              _id: req.user.id,
            },
            { vip: true },
            { new: true }
          );
          debug(result);
        } catch (error) {
          debug(error.message);
          return res.render('vip', {
            errors: [{ msg: 'Unknown error happened try again later' }],
            password: req.body.password,
          });
        }
        return res.redirect('/');
      }
    );
  },
];
