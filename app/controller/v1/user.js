'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async findOne(){
    const uid = this.ctx.params.uid;
    const res = await this.ctx.service.user.findUser({ uid: uid });
    if(!res){
      this.ctx.body = { code: 400, data: 'find failed' };
    } else {
      this.ctx.body = { code: 200, data: res };
    };
  };

  async findCurrent(){
    const { sid } = this.ctx.request.header;
    const sessionData = await this.ctx.service.session.findSession(sid);
      if(!sessionData){
        this.ctx.body = { code: 500, data: 'internal server error'};
      } else {
        const openid = sessionData.openid;
        const res = await this.ctx.service.user.findUser({ openid });
        if(!res) {
          this.ctx.body = { code: 400, data: 'find failed' };
        } else {
          this.ctx.body = { 
            code: 200, 
            data: { 
              uid: res.uid, 
              username: res.username, 
              phone: res.phone 
            } 
          };
        };
      };
  };

  async createOne(){
    try{
      this.ctx.validate({
        username: 'string',
        phone: 'string',
      }, this.ctx.request.body);

      const { username, phone } = this.ctx.request.body;
      const { sid } = this.ctx.request.header;
      const sessionData = await this.ctx.service.session.findSession(sid);
      if(!sessionData){
        this.ctx.body = { code: 500, data: 'internal server error'};
      } else {
        const openid = sessionData.openid;
        const res = await this.ctx.service.user.createUser({ username, openid, phone });
        if(!res){
          this.ctx.body = { code: 500, data: 'internal server error' };
        } else {
          this.ctx.body = { 
            code: 200, 
            data: { 
              username: res.username, 
              uid: res.uid, 
              phone: res.phone 
            } 
          };
        }
      }
    } catch (err) {
      console.log(err);
      this.ctx.body = { code: 422, data: err };
    }
  }
}

module.exports = UserController;
