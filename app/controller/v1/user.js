'use strict';

const Controller = require('egg').Controller;
const md5 = require('md5');

class UserController extends Controller {
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
                if(!data[1] || !data[1].username){
                  this.ctx.body = { code: 200, data: { is_new: true, uid: '', sid: data[0].sid, timestamp: data[0].timestamp, user_info: '' }};
                } else {
                  const userInfo = {
                    username: data[1].username,
                    phone: data[1].phone,
                    intro: data[1].intro,
                    gender: data[1].gender,
                    city: data[1].city,
                    email: data[1].email,
                    wxuserinfo: JSON.parse(data[1].wxuserinfo),
                  }
                  this.ctx.body = { code: 200, data: { is_new: false, uid: data[1].uid, sid: data[0].sid, timestamp: data[0].timestamp, user_info: userInfo }}
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
  };

  async getUserInfoWithSidAndTimestamp(){
    const { sid, timestamp, encryptedData, iv } = this.ctx.request.body;
    console.log(this.ctx.request.body)

    const sessionData = await this.ctx.service.session.findSession(sid, timestamp);
    if(sessionData.code !== 200){
      this.ctx.body = sessionData;
    } else {
      const sessionKey = sessionData.data.session_key;
      const openid = sessionData.data.openid;
  
      const decryptedUserInfo = await this.ctx.decryptUserInfo(encryptedData, sessionKey, iv);
      const decryptedOpenid = decryptedUserInfo.openId;

      if(openid !== decryptedOpenid) {
        this.ctx.body = { code: 422, message: 'invalid user info' };
      } else {
        const uid = md5(openid+this.config.keychain.user.salt);
        await this.ctx.service.user.updateUserWxInfoWithOpenid(uid, openid, JSON.stringify(decryptedUserInfo));
        const userData = await this.ctx.service.user.findUser({ uid });
        if(!userData) {
          this.ctx.body = { 
            code: 200, 
            data: {
              uid, 
              sid, 
              is_new: true 
            }
          }
        } else {
          this.ctx.body = { 
            code: 200, 
            data: { 
              uid: userData.uid,
              sid,
              is_new: false
            }
          }
        }
      }
  
    }
  }

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
    try {

      const { uid, sid } = this.ctx.request.query;
      const sessionData = await this.ctx.service.session.findSession(sid);

      if(!sessionData){
        this.ctx.body = { code: 410, data: 'auth failed, please check your uid and sid' };
      } else {
        const openid = sessionData.data.openid;
        if(uid !== md5(openid+this.config.keychain.user.salt)){
          this.ctx.body = { code: 410, data: 'auth failed, please check your uid and sid' };
        } else {
          const res = await this.ctx.service.user.findUser({ uid });
          this.ctx.body = {
            code: 200, 
            data: { 
              is_new: res.username ? false : true,
              uid: res.uid || '', 
              username: res.username || '', 
              phone: res.phone || '',
              intro: res.intro || '',
              gender: res.gender || '',
              city: res.city || '',
              email: res.email || '',
            }
          };
        }
      };
    } catch(err) {
      this.ctx.body = { code: 500, data: err }
    }
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
        const uid = md5(openid+this.config.keychain.user.salt);
        const res = await this.ctx.service.user.createUser({ username, openid, phone }, uid);
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
