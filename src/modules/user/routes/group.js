var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('@user/group/index');
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
      id: req.params.id,
      name: '',
      description: '',
      permissions: [],
    }

    let viewData = {
      group: group,
      permissions: permissions
    }

    res.render('@user/group/edit', viewData);
  } else {
    knex('groups').first('*').where({id: id}).then(function(group){
      group.permissions = JSON.parse(group.permissions);
      res.render('@user/group/edit', {group: group, permissions: permissions});
    });
  }

})

router.post('/save', function(req, res){

  req.checkBody('group[name]', 'Name should not be empty').notEmpty();

  let errors = req.validationErrors();
  if(errors) {
      var responseBody = {
        errorType: 'validation',
        errors: errors
      }
      res.json(responseBody, 400);
      return;
  }

  let postData = req.body.group;
  let gM = req.app.model('@user/group');

  if(postData.id=== 'new') {

    let insertData = {
      name: postData.name,
      description: postData.description,
      permissions: JSON.stringify(postData.permissions)
    }

    gM.insert(insertData).then(function(a){
      let response = {
        id: a[0],
        status: 'success',
        message: 'Group saved',
      }
      res.json(response);
    });
  } else {
    let updateData = {
      name: postData.name,
      description: postData.description,
      permissions: JSON.stringify(postData.permissions)
    }

    gM.update(postData.id, updateData).then(function(){
      let response = {
        id: postData.id,
        status: 'success',
        message: 'Group updated',
      }
      res.json(response);
    });
  }

});

module.exports = router;
