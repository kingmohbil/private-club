const monggose = require('mongoose');
const Schema = monggose.Schema;
const userSchema = new Schema({
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
});

userSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = monggose.model('users', userSchema);
