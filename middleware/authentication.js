const debug = require('debug')('authentication');
exports.authenticated = (req, res, next) => {
  debug(`Authentication status: ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

exports.notAuthenticated = (req, res, next) => {
  debug(`Authentication status: ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) return res.redirect('/');
  next();
};
