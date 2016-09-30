var express = require('express');
var router  = express.Router();

router.get('/file', function(req, res) {
  res.render('@file/index.html');

});

router.get('/file/data', function(req, res) {
  res.json([]);
});


module.exports = router;
