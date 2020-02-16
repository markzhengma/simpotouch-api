'use strict';

const Controller = require('egg').Controller;

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
        start_date: 'string',
        end_date: 'string',
        start_time: 'string',
        end_time: 'string',
        total_attend: 'number',
        info: 'string',
      }, this.ctx.request.body);

      const { userid, title, location, start_date, end_date, start_time, end_time, total_attend, info } = this.ctx.request.body;

      // this.ctx.body = this.ctx.request.body;

      const eventData = {
        userid,
        title,
        location,
        start_date,
        end_date,
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
  }
}

module.exports = EventController;
