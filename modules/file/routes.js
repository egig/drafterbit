var express = require('express');
var router  = express.Router();

router.get('/desk/file', function(req, res) {
  res.render('@file/index.html');

});

module.exports = router;
