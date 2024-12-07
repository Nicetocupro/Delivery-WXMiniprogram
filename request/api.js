/**
 * 在api.js中，将所有的接口统一管理
 */
const userApi = require('./module/userApi');
const storeApi = require('./module/storeApi');
const cartApi = require('./module/cartApi');
const addressApi = require('./module/addressApi');
const userOrderApi = require('./module/userOrderApi');
const riderOrderApi = require('./module/riderOrderApi')
const commentApi = require('./module/commentApi');
const riderApi = require('./module/riderApi');
const utilsApi = require('./module/utilsApi');

module.exports = {
    ...userApi,
    ...storeApi,
    ...cartApi,
    ...addressApi,
    ...userOrderApi,
    ...riderOrderApi,
    ...commentApi,
    ...riderApi,
    ...utilsApi
};
