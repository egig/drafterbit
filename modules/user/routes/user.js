var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {

    var knex = req.app.get('knex');

    knex('users').select('*').then(function(users){
        res.render('@user/index.html', {
            users: users,
         });
    });
});

router.get('/data', function(req, res) {

    var knex = req.app.get('knex');

    knex('users').select('*').then(function(users){
        var content = {
            recordsTotal: users.length,
            recordsFiltered: users.length,
            data: users
        }

        res.json(content);

    });
});

router.get('/edit/:id', function(req, res){
    var id = req.params.id;
    var knex = req.app.get('knex');

    knex('groups').select('*').then(function(groups){
      var user = {};
      if(id === 'new') {

        user.id = id;
        user.email = null;
        user.password = null;
        user.url = null;
        user.bio = null;
        user.username = null;
        user.realname = null;
        user.groups = [];
        user.groupIds = [];

        res.render('@user/edit.html', {data: user, groups: groups });

      } else {

        knex('users').first('*').where('id', id).then(function(user){

          knex('users_groups').select('*').where('user_id', user.id).then(function(users_groups){

            var ugids = [];
            for(var i=0;i<users_groups.length;i++){
              ugids.push(users_groups[i].group_id);
            }

            knex('groups').select('*').whereIn('id', ugids).then(function(ug){

              user.groups = ug;
              user.groupIds = [];

              for(var i=0;i<user.groups.length;i++){
                user.groupIds.push(user.groups[i].id);
              }

              res.render('@user/edit.html', {data: user, groups: groups });

            })

          });
        });

      }
    });
});

router.post('/save', function(req, res){
  var u = req.body.user;

  // @todo validation
  var knex = req.app.get('knex');

  if(u.id === 'new') {
    knex('users').insert({
      username: u.username,
      email: u.email,
      password: u.password,
      realname: u.realname,
      url: u.url,
      bio: u.bio,
      status: u.status,
    }).then(function(a) {
      res.json({id: a})
    });
  } else {
    knex('users').where('id', u.id).update({
      username: u.username,
      email: u.email,
      password: u.password,
      realname: u.realname,
      url: u.url,
      bio: u.bio,
      status: u.status,
    }).then(function(a) {
      res.json({id: a})
    });
  }

});

router.post('/delete', function(req, res){
  var u = req.body.user;

  // @todo validation
  var knex = req.app.get('knex');
  knex('users').whereIn('id', req.body.users).del().then(function(){
    res.json({status: 200});
  })

});

module.exports = router;
