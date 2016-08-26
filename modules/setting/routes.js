var express = require('express');
var router  = express.Router();

router.get('/desk/setting/general', function(req, res) {
  res.render('@setting/general/index.html');

});

router.get('/desk/setting/menu', function(req, res) {
  res.render('@setting/menu.html');

});

router.get('/desk/setting/themes', function(req, res) {
  res.render('@setting/themes.html');

});

module.exports = router;
