'use strict';

const Service = require('egg').Service;

class EventService extends Service {
  async findAll(){
    const res = await this.ctx.model.Event.find();
    return res;
  };
  async findWithId(id){
    const res = await this.ctx.model.Event.findOne({ _id: id });
    return res;
  };
  async create(data){
    const res = await this.ctx.model.Event.create(data);
    return res;
  }
}

module.exports = EventService;
