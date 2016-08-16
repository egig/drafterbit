var express = require('express');
var router  = express.Router();
var jwt = require('jsonwebtoken');

router.get('/login', function(req, res) {

  if(req.headers.referer) {
    req.session.pageBeforeLogin = req.headers.referer;
  }

    res.render('@security/login.html');
});

router.post('/login', function(req, res) {
    if(!req.body._email) {
        return res.status(400).send('Email requried');
    }

    if(!req.body._password) {
        return res.status(400).send('Password requried');
    }

    var next = '/desk';
    if(req.session.pageBeforeLogin) {
      next = req.session.pageBeforeLogin;
      req.session.pageBeforeLogin = null;
    }

    var token = jwt.sign({email: req.body._email }, req.app.get('secret'));

    req.session.JWToken = token;

    res.redirect(next);
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
