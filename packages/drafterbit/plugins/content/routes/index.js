const type = require('./type');
const content = require('./content');
const Router = require('@koa/router');

let router = new Router();
router.use(type);
router.use(content);

module.exports =  router.routes();