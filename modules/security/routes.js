var express = require('express');
var router  = express.Router();
var jwt = require('jsonwebtoken');

router.get('/login', function(req, res) {

  if(req.headers.referer) {
    req.session.pageBeforeLogin = req.headers.referer;
  }

  var loginError = req.flash('loginError');

  res.render('@security/login.html', {loginError: loginError});
});

router.post('/login', function(req, res) {
    if(!req.body._email) {
        return res.status(400).send('Email requried');
    }

    if(!req.body._password) {
        return res.status(400).send('Password requried');
    }

    var next = '/desk';
    /*if(req.session.pageBeforeLogin) {
      next = req.session.pageBeforeLogin;
      req.session.pageBeforeLogin = null;
    }*/

    var  knex = req.app.get('knex');

    knex('users').first().where({
      email: req.body._email,
      password: req.body._password // @todo encryption
    }).then(function(user){
      console.log(user);

      if(user) {
        var token = jwt.sign(user, req.app.get('secret'));

        req.session.JWToken = token;

        return res.redirect(next);
      } else {
        req.flash('loginError', 'User not found');
        return res.redirect('/login');
      }
    });

});

router.get('/signup', function(req, res) {
    res.render('signup.html');
});

router.post('/signup', function(req, res) {
  return res.json({});
});

router.get('/logout', function(req, res) {
    req.session.JWToken = null;
    res.redirect('/login');
});


module.exports = router;
