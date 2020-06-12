'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');

class EventController extends Controller {
  async findAll(){
    const data = await this.ctx.service.event.findAll();
    if(data){
        this.ctx.body = { code: 200, data: data};
      } else {
        this.ctx.body = { code: 400, data: 'find failed'};
      }
  };
  async findWithId(){
    const data = await this.ctx.service.event.findWithId(this.ctx.params.id);
    if(data){
        this.ctx.body = { code: 200, data: data};
      } else {
        this.ctx.body = { code: 400, data: 'find failed'};
      }
  };
  async create(){
    try{
      this.ctx.validate({
        userid: 'string',
        title: 'string',
        tags: 'array',
        location: 'string',
        date: 'string',
        start_time: 'string',
        end_time: 'string',
        total_attend: 'number',
        info: 'string',
      }, this.ctx.request.body);

      const { userid, title, location, date, start_time, end_time, total_attend, info } = this.ctx.request.body;

      // this.ctx.body = this.ctx.request.body;

      const eventData = {
        userid,
        title,
        location,
        date,
        start_time,
        end_time,
        total_attend,
        curr_attend: 0,
        info
      };

      const res = await this.ctx.service.event.create(eventData);
      if(res){
        this.ctx.body = { code: 200, data: res};
      } else {
        this.ctx.body = { code: 400, data: 'create failed'};
      }
    } catch(err) {
      console.log(err)
      this.ctx.body = { code: 422, data: err }
    }
  };


  async test(){
    const file = this.ctx.request.files[0];
    console.log(file)
    // try{
    //   const fileSize = fs.statSync(file.filepath).size;
    //   const res = await this.ctx.curl(
    //     `http://feedback.kuwo.cn/f/upload`,
    //     {
    //       method: 'POST',
    //       files: {
    //         file: file.filepath
    //       },
    //       headers: {
    //         'content-type': 'multipart/form-data',
    //         'content-length': fileSize,
    //         'expect': '100-continue'
    //       },
    //       timeout: 1500,
    //     },
    //   );

    //   if(file.filepath) {
    //     await fs.unlink(file.filepath);
    //     console.log('deleted')
    //   }
  
    //   this.ctx.body = res
    // } catch(err) {
    //   console.log(err);
    //   if(file.filepath) {
    //     await fs.unlink(file.filepath);
    //   }
    //   this.ctx.body = err
    // }


    const axios = require('axios');
    const FormData = require('form-data');

    const form = new FormData();
    const stream = fs.createReadStream(file.filepath);
    form.append('file', stream);
    console.log(fs.statSync(file.filepath))

    try{
      const res = await axios({
          method: 'POST',
          url: 'http://feedback.kuwo.cn/f/upload', 
          data: form,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Content-Length': fs.statSync(file.filepath).size,
          },
      });
      if(file.filepath) {
        await fs.unlink(file.filepath);
      }
  
      this.ctx.body = res
    } catch(err) {
      if(file.filepath) {
        await fs.unlink(file.filepath);
      }
      this.ctx.body = err;
    }

  }
}

module.exports = EventController;
