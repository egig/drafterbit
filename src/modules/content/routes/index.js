const express = require('express');
const content_type = require('./content_type');
const content = require('./content');
const main = require('./main');

let router = express.Router();
router.use(content_type);
router.use(content);
router.use(main);

module.exports =  router;