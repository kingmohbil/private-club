const debug = require('debug')('debug');
const LocalStrategy = require('passport-local').Strategy;
const users = require('./models/users-model');
const bcrypt = require('bcryptjs');
function initialize(passport) {
  debug('Initializing passport instance');
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, function (
      email,
      password,
      done
    ) {
      debug(`starting authantication for ${email}`);
      users.findOne({ email: email }, (err, user) => {
        if (err) return done(err);
        if (!user)
          return done(null, false, {
            message: `User ${email} Cannot be found`,
          });
        bcrypt.compare(password, user.password, (err, success) => {
          debug(`${email} found and checking password`);
          if (err) {
            debug(err);
            return done(err);
          }
          if (!success) {
            debug(`passwords doesn't match`);
            return done(null, false, { message: 'Password is incorrect' });
          }
          debug(`user authanticated successfully`);
          return done(null, user);
        });
      });
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, users.findById(id));
  });
}

module.exports = initialize;
