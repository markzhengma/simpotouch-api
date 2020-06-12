'use strict';

const Service = require('egg').Service;
const md5 = require('md5');

class SessionService extends Service {
  async validateSid(sid, timestamp) {
    const res = await this.ctx.model.Session.findOne({ sid });

    const sidKey = this.config.keychain.session.key;
    const expectedSid = md5(res.openid+sidKey+timestamp);

    if(timestamp && expectedSid !== sid) {
      return { code: 400, message: 'invalid session' }
    } else {
      const currTime = new Date().getTime();
  
      if(!res) {
        return { code: 400, message: 'session not found' }
      } else if(res.expire < currTime) {
        return { code: 500, message: 'session expired' }
      } else {
        return { code: 200, data: res };
      }
    }

  };

  async findSession(sid) {
    const res = await this.ctx.model.Session.findOne({ sid });

    if(!res) {
      return { code: 400, data: 'invalid session' };
    };

    if(res.expire < new Date().getTime()) {
      return { code: 410, data: 'session expired, please login again' };
    };

    return { code: 200, data: res };
  }

  async updateSession(openid, session_key) {
    const today = new Date();
    const timestamp = today.getTime();
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1);
    const sidKey = this.config.keychain.session.key;
    const sid = md5(openid+sidKey+timestamp)
    await this.ctx.model.Session.updateOne(
      {
        openid,
      },
      {
        sid,
        session_key,
        expire: tomorrow.getTime(),
      },
      {
        new: true,
        upsert: true,
        useFindAndModify: false,
      });
    return { sid, timestamp };
  };
}

module.exports = SessionService;
