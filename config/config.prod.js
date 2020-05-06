/* eslint valid-jsdoc: "off" */

'use strict';

module.exports = () => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1578536605388_1366';

  // add your middleware config here
  config.middleware = [];

  config.mongoose = {
    url: process.env.EGG_MONGODB_URL || 'mongodb://172.18.0.1:27017/simpotouch',
    server: {
      poolSize: 40,
    },
    option: { useUnifiedTopology: true },
  };

  return {
    ...config,
  };
};
