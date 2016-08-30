var express = require('express');
var router = express.Router();

router.get('/', function(req, res){

    res.render('@blog/post/index.html');
});


router.get('/data', function(req, res){
  var knex = req.app.get('knex');

  knex('posts').select('*').then(function(posts){


      var content = {
          recordsTotal: posts.length,
          recordsFiltered: posts.length,
          data: posts
      }

      res.json(content);

  });
})

module.exports = router;
