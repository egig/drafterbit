var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  var knex = req.app.get('knex');

  knex('groups').select('*')
  res.render('@user/group/index.html');
})

router.get('/data', function(req, res) {

    var knex = req.app.get('knex');

    knex('groups').select('*').then(function(groups){
        var content = {
            recordsTotal: groups.length,
            recordsFiltered: groups.length,
            data: groups
        }

        res.json(content);

    });
});


module.exports = router;
