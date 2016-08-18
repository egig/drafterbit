var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/desk/user', function(req, res) {

    var knex = req.app.get('knex');

    knex('users').select('*').then(function(users){
        res.render('@user/index.html', {
            users: users,
             __: function(s) {return s},
             token: req.session.JWToken
         });
    });
});

router.get('/desk/user/data', function(req, res) {

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


router.get('/desk/user/edit/:id', function(req, res){
    var id = req.params.id;
    var knex = req.app.get('knex');

    knex('groups').select('*').then(function(groups){
      var user = {};
      if(id === 'new') {

        user.email = null;
        user.password = null;
        user.url = null;
        user.bio = null;
        user.username = null;
        user.realname = null;
        user.groups = [];

        res.render('@user/edit.html', {data: user, groups: groups });

      } else {

        knex('users').first('*').where('id', id).then(function(user){

          knex('users').select('*').where('user_id', user.id).then(function(groups){
            user.groups = groups;

            res.render('@user/edit.html', {data: user, groups: groups });

          });
        });

      }
    });
});

module.exports = router;
