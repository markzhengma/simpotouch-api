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
        this.ctx.body = { code: 400, data: 'session not found' };
      } else {
        const openid = sessionData.openid;
        const res = await this.ctx.service.user.findUser({ openid });
        if(!res) {
          this.ctx.body = { code: 200, data: { is_new: true } };
        } else {
          this.ctx.body = { 
            code: 200, 
            data: { 
              is_new: false,
              uid: res.uid, 
              username: res.username, 
              phone: res.phone,
              intro: res.intro,
              gender: res.gender,
              city: res.city,
              email: res.email,
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
  };

  async updateOne(){
    const updateData = this.ctx.request.body;
    const { sid, uid } = this.ctx.request.header;
    const sessionData = await this.ctx.service.session.findSession(sid);
    const userData = await this.ctx.service.user.findUser({ uid });
    if(!sessionData || !userData || (sessionData && userData) && sessionData.openid !== userData.openid) {
      this.ctx.body = { code: 500, data: 'internal server error'};
    } else {
      const res = await this.ctx.service.user.updateUser(uid, updateData);
      if(res.ok === 1) {
        const updatedUser = await this.ctx.service.user.findUser({ uid });
        if(!updatedUser) {
          this.ctx.body = { code: 500, data: 'internal server error'};
        } else {
          const returnData = {
            uid: updatedUser.uid,
            username: updatedUser.username,
            phone: updatedUser.phone,
            intro: updatedUser.intro,
            gender: updatedUser.gender,
            city: updatedUser.city,
            email: updatedUser.email
          }
          this.ctx.body = { code: 200, data: returnData };
        }
      } else {
        this.ctx.body = { code: 500, data: res};
      }
    }
  }
}

module.exports = UserController;
