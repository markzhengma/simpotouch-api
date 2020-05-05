'use strict'

module.exports = {
  async getOpenId(encryptedData, sessionKey, iv) {
    const WXBizDataCrypt = require('../../lib/WXBizDataCrypt');
    const appid = this.config.wx.appid;

    const pc = new WXBizDataCrypt(appid, sessionKey);

    const data = pc.decryptData(encryptedData , iv);

    return data;
  }
}