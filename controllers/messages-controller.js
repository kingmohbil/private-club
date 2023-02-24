const debug = require('debug')('controllers');
const authenticatedMiddleware = require('../middleware/authentication');
const messages = require('../models/message-model');
const users = require('../models/users-model');
const { body, validationResult } = require('express-validator');
exports.getAddMessages = [
  authenticatedMiddleware.authenticated,
  (req, res, next) => {
    return res.render('messages');
  },
];
exports.addMessage = [
  (req, res, next) => {
    debug('Starting validation for message');
    return next();
  },
  body('title', '* Title can`t be empty')
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 80 })
    .withMessage('* Title can`t exceed 80 characters')
    .escape(),
  body('message', '* Message can`t be empty')
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 160 })
    .withMessage('* Message can`t exceed 160 characters')
    .escape(),
  async (req, res) => {
    const isValid = validationResult(req);
    if (!isValid.isEmpty()) {
      debug('Validation for message was not successful');
      return res.render('messages', {
        errors: isValid.array(),
        title: req.body.title,
        message: req.body.message,
      });
    }
    debug('Validation for message was successful');
    try {
      debug('adding a message to database');
      const message = new messages({
        title: req.body.title,
        message: req.body.message,
        author: req.user.id,
      });
      const result = await users.findOneAndUpdate(
        { _id: req.user.id },
        { $push: { messages: message.id } },
        { new: true }
      );
      message.save();
      debug(result);
      return res.redirect('/');
    } catch (error) {
      debug(error);
      return res.render('messages', {
        errors: [{ msg: '* Something went wrong try again later' }],
        title: req.body.title,
        message: req.body.message,
      });
    }
  },
];

exports.deleteMessage = async (req, res, next) => {
  if (!req.user.vip)
    return next(
      new Error('The user does not have access to the requested request')
    );
  try {
    const Message = await messages.findOne({ _id: req.params.id }, 'author');
    const messageResult = await messages.deleteOne({ _id: req.params.id });
    const userResult = await users.updateOne(
      { _id: Message.author },
      {
        $pull: { messages: req.params.id },
      }
    );
  } catch (error) {
    debug(err.message);
  } finally {
    return res.redirect('/');
  }
};
