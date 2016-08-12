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


    var user = {};
    if(id === 'new') {
      user.email = null;
      user.password = null;

      res.render('@user/edit.html', {data: user });

    } else {

      knex('users').first('*').where('id', id).then(function(user){
          res.json(user);

      });

    }
});

module.exports = router;
