'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    openid: {
      type: String,
      default: '',
    },
    uid: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
  });

  return mongoose.model('User', UserSchema);
};
