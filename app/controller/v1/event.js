'use strict';

const Controller = require('egg').Controller;

class EventController extends Controller {
  async findAll(){
    const data = await this.ctx.service.event.findAll();
    this.ctx.body = data;
  };
  async findWithId(){
    const data = await this.ctx.service.event.findWithId(this.ctx.params.id);
    this.ctx.body = data;
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

      const { userid, title, tags, location, start_date, end_date, start_time, end_time, total_attend, info } = this.ctx.request.body;

      // this.ctx.body = this.ctx.request.body;

      const eventData = {
        userid,
        title,
        tags,
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
      this.ctx.body = res;
    } catch(err) {
      console.log(err)
      this.ctx.body = { code: 422, data: err }
    }
  }
}

module.exports = EventController;
