'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SessionSchema = new Schema({
    openid: {
      type: String,
      default: '',
    },
    sid: {
      type: String,
      default: '',
    },
    session_key: {
      type: String,
      default: '',
    },
    expire: {
      type: Number,
      default: 0,
    },
  });

  return mongoose.model('Session', SessionSchema);
};
