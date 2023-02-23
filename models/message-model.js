const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  'messages',
  new Schema({
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    title: {
      type: String,
      maxLength: 80,
      required: true,
    },
    message: {
      type: String,
      maxlength: 160,
      required: true,
    },
    date_created: {
      type: Date,
      default: () => new Date(Date.now()).toISOString(),
      immutable: true,
    },
  })
);
