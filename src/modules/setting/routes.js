var express = require('express');
var router  = express.Router();

router.get('/setting/general', function(req, res) {
  res.render('@setting/general/index.html');

});

router.get('/setting/menu', function(req, res) {

  var mM = req.app.model('@setting/menu');

  mM.getAll(function(err, menus){
    if(err) {
      return console.log(err);
    }

    var data = {
      menus: menus
    }

    console.log(menus);

    res.render('@setting/menu.html', data);
  });

});

router.get('/setting/themes', function(req, res) {

  var themes = req.app.get('themeManager').getThemes();

  res.render('@setting/themes.html', { themes: themes });

});

router.get('/setting/theme/customize', function(req, res) {

  res.render('@setting/theme_customize.html');

});

module.exports = router;
