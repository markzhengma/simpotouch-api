'use strict';

const Service = require('egg').Service;
const mongoose = require('mongoose');

class UserService extends Service {
  async findUser(params) {
    const res = await this.ctx.model.User.findOne(params);
    return res;
  };

  async createUser(user) {
    const { openid, username, phone } = user;
    const objId = new mongoose.Types.ObjectId();
    const res = await this.ctx.model.User.create(
      {
        openid,
        uid: objId.toString(),
        username,
        phone
      });
    return res;
  };

  async updateUser(uid, data) {
    const res = await this.ctx.model.User.updateOne( { uid }, data);
    return res;
  }
}

module.exports = UserService;
