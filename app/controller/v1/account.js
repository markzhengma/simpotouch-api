'use strict';

const Controller = require('egg').Controller;

class AccountController extends Controller {
  async wxLogin() {
    try {
      this.ctx.validate({
        code: { type: 'string', required: true },
      }, this.ctx.request.header);

      const code = this.ctx.request.header.code;

      const appid = this.config.wx.appid;
      const secret = this.config.wx.secret;

      return new Promise(resolve => {
        resolve(this.ctx.service.account.wxLogin(appid, secret, code));
      })
        .then(res => {
          if (res.data.errmsg) {
            this.ctx.body = { code: 410, data: res.data.errmsg }
          } else if (res.data.openid) {
            return Promise.all([
              this.ctx.service.session.updateSession(res.data.openid, res.data.session_key),
              this.ctx.service.user.findUser({openid: res.data.openid})
            ])
              .then(data => {
                if(!data[1]){
                  this.ctx.body = { code: 200, data: { sid: data[0].sid }};
                } else {
                  this.ctx.body = { code: 200, data: { sid: data[0].sid, uid: data[1].uid }}
                }
              })
              .catch(err => {
                this.ctx.logger.error(new Error(err));
                this.ctx.body = { code: 500, data: 'internal server error'};
              });
          }
        })
        .catch(err => {
          this.ctx.logger.error(new Error(err));
          this.ctx.body = { code: 500, data: 'internal server error'};
        });
    } catch (err) {
      this.ctx.logger.error(new Error(err));
      this.ctx.body = { code: 422, data: err};
    }
  }
}

module.exports = AccountController;
