var express = require('express');
var router = express.Router();

var user = require('./user');
var group = require('./group');

router.use('/desk/user', user);
router.use('/desk/user/group', group);

module.exports = router;
