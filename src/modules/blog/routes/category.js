var express = require('express');
var router = express.Router();

router.get('/', function(req, res){

    res.render('@blog/category/index.html');
});


router.get('/data', function(req, res){
  var knex = req.app.get('knex');

  knex('categories').select('*').then(function(posts){


      var content = {
          recordsTotal: posts.length,
          recordsFiltered: posts.length,
          data: posts
      }

      res.json(content);

  });
})

module.exports = router;
