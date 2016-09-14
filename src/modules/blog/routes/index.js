var express = require('express');
var router = express.Router();

var post = require('./post');
var category = require('./category');
var comment = require('./comment');

router.use('/desk/blog/post', post);
router.use('/desk/blog/category', category);
router.use('/desk/blog/comment', comment);

module.exports = router;
