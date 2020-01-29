/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1578536605388_1366';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      ignoreJSON: true,
    },
  };

  config.wx = {
    appid: 'wx3a27f7cc03bce8d9',
    secret: '88557736e0ec52183420079f487ec294'
  }

  config.mongoose = {
    url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1:27017/simpotouch',
    server: {
      poolSize: 40,
    },
    option: { useUnifiedTopology: true },
  };

  return {
    ...config,
    ...userConfig,
  };
};
