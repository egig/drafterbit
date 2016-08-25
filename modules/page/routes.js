var express = require('express');
var router  = express.Router();

router.get('/desk/page', function(req, res) {
  res.render('@page/index.html');

});

router.get('/desk/page/data', function(req, res) {

  var knex = req.app.get('knex');

  knex('pages').select('*').then(function(pages){
      var content = {
          recordsTotal: pages.length,
          recordsFiltered: pages.length,
          data: pages
      }

      res.json(content);

  });

});

router.get('/desk/page/edit/:id', function(req, res) {
  res.render('@page/edit.html');

});

module.exports = router;
