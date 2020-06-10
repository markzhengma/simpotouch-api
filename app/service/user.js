'use strict';

const Service = require('egg').Service;
const mongoose = require('mongoose');

class UserService extends Service {
  async findUser(params) {
    const res = await this.ctx.model.User.findOne(params);
    return res;
  };

  async createUser(user, uid) {
    const { openid, username, phone } = user;
    const res = await this.ctx.model.User.create(
      {
        openid,
        uid,
        username,
        phone
      });
    return res;
  };

  async updateUser(uid, data) {
    const res = await this.ctx.model.User.updateOne( { uid }, data);
    return res;
  };

  async updateUserWxInfoWithOpenid(uid, openid, wxInfoStr) {
    const res = await this.ctx.model.User.updateOne(
      { 
        openid,
        uid
      },
      { wxuserinfo: wxInfoStr },
      { upsert: true }
    );
    return res;
  }
}

module.exports = UserService;
