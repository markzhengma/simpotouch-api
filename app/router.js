'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.group({ prefix: '/v1' }, router => {
    router.get('/event/all', controller.v1.event.findAll);
    router.post('/event/single', controller.v1.event.create);
    router.get('/event/single/:id', controller.v1.event.findWithId);

    router.get('/user/wxlogin', controller.v1.user.wxLogin);
    router.post('/user/init', controller.v1.user.getUserInfoWithSidAndTimestamp);

    router.post('/user/single', controller.v1.user.createOne);
    router.put('/user/single', controller.v1.user.updateOne);
    router.get('/user/single/:uid', controller.v1.user.findOne);
    router.get('/user/self', controller.v1.user.findCurrent);
  });
};
