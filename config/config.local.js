/* eslint valid-jsdoc: "off" */

'use strict';

module.exports = () => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // add your middleware config here
  config.middleware = [];

  config.mongoose = {
    url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1:27017/simpotouch',
    server: {
      poolSize: 40,
    },
    option: { useUnifiedTopology: true },
  };

  return {
    ...config,
  };
};
