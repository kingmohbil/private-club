const monggose = require('mongoose');
const Schema = monggose.Schema;

module.exports = monggose.model(
  'users',
  new Schema({
    first_name: {
      type: String,
      minLength: 1,
      maxLength: 20,
      required: true,
    },
    last_name: {
      type: String,
      minLength: 1,
      maxLength: 20,
      required: true,
    },
    email: { type: String, required: true },
    password: { type: String, minLength: 8, required: true },
    vip: {
      type: Boolean,
      default: false,
    },
    messages: [Schema.Types.ObjectId],
  })
);
