var express = require('express');
var router = express.Router();

var post = require('./post');

router.use('/desk/blog/post', post);

module.exports = router;
