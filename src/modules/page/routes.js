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

router.get('/:slug?', function(req, res, next) {

  var frontpage = 'sample-page1'; // @todo get fronrpage from db
  var slug = req.params.slug || frontpage;

  var knex = req.app.get('knex');
  knex('pages').first().where('slug', slug).then(function(page){

    if(!page) {
      return res.render('@theme/404.html')
    }

    res.render('@theme/content/page/view.html', {page: page});

  }).catch(function(e){
     next(e);
  });

});

module.exports = router;
