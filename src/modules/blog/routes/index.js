var express = require('express');
var router = express.Router();

var post = require('./post');
var category = require('./category');
var comment = require('./comment');
var tag = require('./tag');

router.use('/blog/post', post);
router.use('/blog/category', category);
router.use('/blog/comment', comment);
router.use('/blog/tag', tag);

module.exports = router;
