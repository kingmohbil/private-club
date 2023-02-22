require('dotenv').config();
const debug = require('debug')('debug');
const mongoose = require('mongoose');
module.exports = () => {
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.DB_URL, (err) => {
    if (err) {
      debug(err);
      return;
    }
    debug('connected to database successfully');
  });
};
