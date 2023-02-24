const debug = require('debug')('controllers');
const messages = require('../models/message-model');
const authenticatedMiddleware = require('../middleware/authentication');

exports.getHome = [
  authenticatedMiddleware.authenticated,
  async (req, res) => {
    debug(`Welcome back ${req.user.first_name}`);
    messages
      .find({}, null, { sort: { date_created: -1 } }, (err, usersMessages) => {
        if (err) {
          debug(err.message);
          return next(err);
        }
        debug(usersMessages);
        return res.render('home', {
          userMessages: usersMessages,
        });
      })
      .populate('author', 'first_name last_name');
  },
];

exports.logOut = (req, res, next) => {
  debug('Logging out...');
  const name = req.user.first_name;
  req.logout((err) => {
    if (err) {
      debug('Error happened while logging out');
      return next(err);
    }
    debug(`Logged out successfully goodbye ${name}`);
    return res.redirect('/login');
  });
};
