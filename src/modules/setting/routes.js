var express = require('express');
var router  = express.Router();

router.get('/desk/setting/general', function(req, res) {
  res.render('@setting/general/index.html');

});

router.get('/desk/setting/menu', function(req, res) {

  var knex = req.app.get('knex');
  var MenuModel = require('./models/menu');
  var mM = new MenuModel({knex: knex});

  mM.getAll(function(err, menus){
    if(err) {
      return console.log(err);
    }

    var data = {
      menus: menus
    }
    res.render('@setting/menu.html', data);
  });

});

router.get('/desk/setting/themes', function(req, res) {

  var themes = req.app.get('themeManager').getThemes();

  res.render('@setting/themes.html', { themes: themes });

});

router.get('/desk/setting/theme/customize', function(req, res) {

  res.render('@setting/theme_customize.html');

});

module.exports = router;
