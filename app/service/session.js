'use strict';

const Service = require('egg').Service;
const mongoose = require('mongoose');

class SessionService extends Service {
  async findSession(sid) {
    const res = await this.ctx.model.Session.findOne({ sid });
    return res;
  }

  async updateSession(openid, session_key) {
    const objSid = new mongoose.Types.ObjectId();
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const res = await this.ctx.model.Session.findOneAndUpdate(
      {
        openid,
      },
      {
        sid: objSid.toString(),
        session_key,
        expire: tomorrow,
      },
      {
        new: true,
        upsert: true,
        useFindAndModify: false,
      });
    return res;
  }
}

module.exports = SessionService;
