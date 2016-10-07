var express = require('express');
var router = express.Router();

var user = require('./user');
var group = require('./group');

router.use('/user', user);
router.use('/user/group', group);

module.exports = router;
