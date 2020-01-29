'use strict';

const Service = require('egg').Service;

class AccountService extends Service {
  async wxLogin(appid, secret, code) {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    const res = await this.ctx.curl(url, {
      dataType: 'json',
    });
    return res;
  }
}

module.exports = AccountService;
