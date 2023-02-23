const debug = require('debug')('controllers');
const authenticatedMiddleware = require('../middleware/authentication');

exports.getHome = [
  authenticatedMiddleware.authenticated,
  (req, res) => {
    debug(`Welcome back ${req.user.first_name}`);
    return res.render('home');
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
