var express = require('express');
var router  = express.Router();

router.get('/desk/setting/general', function(req, res) {
  res.render('@setting/general/index.html');

});

router.get('/desk/setting/menu', function(req, res) {
  res.render('@setting/menu.html');

});

router.get('/desk/setting/themes', function(req, res) {

  var themes = req.app.get('themeManager').getThemes();

  res.render('@setting/themes.html', { themes: themes });

});

router.get('/desk/setting/theme/customize', function(req, res) {

  res.render('@setting/theme_customize.html');

});

module.exports = router;
