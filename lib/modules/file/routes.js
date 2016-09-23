'use strict';

var express = require('express');
var router = express.Router();

router.get('/desk/file', function (req, res) {
  res.render('@file/index.html');
});

router.get('/desk/file/data', function (req, res) {
  res.json([]);
});

module.exports = router;