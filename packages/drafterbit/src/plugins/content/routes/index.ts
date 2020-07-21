const type = require('./type');
const content = require('./content');
import Router from '@koa/router';

let router = new Router();
router.use(type);
router.use(content);

module.exports =  router.routes();