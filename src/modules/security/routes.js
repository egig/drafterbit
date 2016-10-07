import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import bcrypt from  'bcrypt-nodejs';

router.get('/login', function(req, res) {

  if(req.headers.referer) {
    req.session.pageBeforeLogin = req.headers.referer;
  }

  var loginError = req.flash('loginError');

  res.render('@security/login', {loginError: loginError});
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
    }).then(function(user){

      if(!user) {
        req.flash('loginError', 'User not found');
        return res.redirect(req.app.deskUrl('/login'));
      }

      if(!bcrypt.compareSync(req.body._password, user.password)) {
        req.flash('loginError', 'Password or email incorrect');
        return res.redirect(req.app.deskUrl('/login'));
      }

      var token = jwt.sign(user, req.app.get('secret'));
      req.session.JWToken = token;
      return res.redirect(next);
    });
});

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.post('/signup', function(req, res) {
  return res.json({});
});

router.get('/logout', function(req, res) {
    req.session.JWToken = null;
    res.redirect(req.app.deskUrl('/login'));
});


module.exports = router;
