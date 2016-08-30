var express = require('express');
var router = express.Router();

var post = require('./post');
var category = require('./category');

router.use('/desk/blog/post', post);
router.use('/desk/blog/category', category);

module.exports = router;
