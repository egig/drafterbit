const express = require('express');
const content_type = require('./content_type');
const content = require('./content');

let router = express.Router();
router.use(content_type);
router.use(content);

module.exports =  router;