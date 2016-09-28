var express = require('express');
var router = express.Router();

var post = require('./post');
var category = require('./category');
var comment = require('./comment');
var tag = require('./tag');

router.use('/desk/blog/post', post);
router.use('/desk/blog/category', category);
router.use('/desk/blog/comment', comment);
router.use('/desk/blog/tag', tag);

module.exports = router;
