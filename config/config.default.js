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

  config.security = {
    csrf: {
      ignoreJSON: true,
    },
  };

  config.wx = {
    appid: 'wx3a27f7cc03bce8d9',
    secret: '88557736e0ec52183420079f487ec294'
  }

  return {
    ...config,
    ...userConfig,
  };
};
