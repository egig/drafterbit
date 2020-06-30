const express = require('express');
const type = require('./type');
const content = require('./content');

let router = express.Router();
router.use(type);
router.use(content);

module.exports =  router;