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


router.get('/edit/:id', function(req, res){
  var id = req.params.id;
  var knex = req.app.get('knex');

  knex('groups').first('*').where({id: id}).then(function(group){
    res.render('@user/group/edit.html', {data: group});
  });

})

module.exports = router;
