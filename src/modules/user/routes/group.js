var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
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
  let id = req.params.id;
  let knex = req.app.get('knex');
  let permissions = req.app.get('permissions');

  if(req.params.id === 'new') {
    let group = {
      name: '',
      description: '',
    }

    let viewData = {
      group: group,
      permissions: permissions
    }

    res.render('@user/group/edit.html', viewData);
  } else {
    knex('groups').first('*').where({id: id}).then(function(group){
      res.render('@user/group/edit.html', {group: group, permissions: permissions});
    });
  }

})

module.exports = router;
