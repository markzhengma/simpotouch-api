'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const EventSchema = new Schema({
    userid: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    start_date: {
      type: String,
      default: '',
    },
    end_date: {
      type: String,
      default: '',
    },
    start_time: {
      type: String,
      default: '',
    },
    end_time: {
      type: String,
      default: '',
    },
    total_attend: {
      type: Number,
      default: 0,
    },
    curr_attend: {
      type: Number,
      default: 0
    },
    info: {
      type: String,
      default: '',
    },
  });
  return mongoose.model('Event', EventSchema);
};
