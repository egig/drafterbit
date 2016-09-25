import fs from 'fs';
import path from 'path';

import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import nunjucks from 'nunjucks';
import session from 'express-session';
import flash from 'connect-flash';
import express from 'express';
import expressJWT from 'express-jwt';
import expressValidator from 'express-validator';
import winston from 'winston';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import Module from './module';
import nunjucksModuleLoader from './nunjucks/module-loader';

const drafterbit = express.application;
const _isRelative = function(filename) {
    return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
}

drafterbit.load = function load(_ROOT) {
  if(this.registerModules === undefined) {
    throw Error("Drafterbit app must declare registerModules method before boot");
  }

  this._ROOT = _ROOT;
  this._modules = [];
  this._modulePaths =  this.registerModules();
  this._initConfig();
  this._initModules();
  this._boot();
}

drafterbit._boot = function() {

  this._initModules();
  this._initDB();
  this._initAppLogger();
  this._initViews();
  this._initBaseMiddlewares();
  this._initStaticMiddlewares();
  this._initSecurityMiddleware();

  // add req user to nunjucks env as global
  let _this = this;
  this.use(function(req, res, next){
    try {
      if(req.user) {
        _this._nunjucksEnv.addGlobal('user', req.user);
        _this._nunjucksEnv.addGlobal('_jwtToken', req.session.JWToken);
      }
    } catch (e) {
      console.log(e);
    }
    next();
  });

  this._initRoutes();
  this._initThemes();

  // not found handle
  this.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  this._initErrorhandler();
  return true;
}

drafterbit._initErrorhandler = function() {
  if (this.get('env') === 'development') {
    this.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error.html', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  this.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
      message: err.message,
      error: {}
    });
  });
}

drafterbit._initThemes =  function(){
  let ThemeManager = require('./theme-manager');
  let themeManager = new ThemeManager(this._ROOT);

  this.set('themeManager', themeManager);
}

drafterbit._initSecurityMiddleware = function(){
  // JWT simple auth setup, we redirect unauthorized to login page
  // @todo move secret to config
  this.use(/^\/desk/,expressJWT({
      secret: this._CONFIG.secret,
      getToken: function fromHeaderOrQuerystring (req) {
          if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
              return req.headers.authorization.split(' ')[1];
          } else if (req.query && req.query.token) {
              return req.query.token;
          } else if (req.session.JWToken) {
              return req.session.JWToken;
          }

          return null;
        }
  }).unless({path: ['/login', '/signup']}));

  this.use(function (err, req, res, next) {

      // @todo check if request is ajax and return json
    if (err.name === 'UnauthorizedError') {
      res.redirect('/login');
    } else {
       // @why this is not executed ??
       // console.log(req.user);
    }
  });
}

drafterbit._initStaticMiddlewares = function() {
  for(var name in this._modules) {
      this.use('/'+name, express.static( this._modules[name].getPublicPath()));
  }
}

drafterbit._initBaseMiddlewares = function() {
  this.use(logger('dev'));
  this.use(bodyParser.urlencoded({ extended: true }));
  this.use(bodyParser.json());
  this.use(expressValidator());
  this.use(cookieParser());
  this.use(express.static(path.join(this._ROOT, 'public')));
  this.use('/bower_components', express.static(path.join(this._ROOT, 'bower_components')));

  this.use(session({ secret: this._CONFIG.secret })); // session secret
  this.use(flash()); // use connect-flash for flash messages stored in session
}

drafterbit._initViews = function() {

  let viewPaths = [this._ROOT+'/views'];
  this._nunjucksEnv = new nunjucks.Environment(
      new nunjucksModuleLoader(this._modules, {paths: viewPaths}),
      {
          autoescape: false
      }
  );
  this._nunjucksEnv.express(this);
  this._nunjucksEnv.addGlobal('__', function(s){
    // @todo translation
        return s;
    })
  this._nunjucksEnv.addGlobal('isExists', function(el, arr){
    return arr.indexOf(el) !== -1;
  })
  this._nunjucksEnv.addGlobal('gravatar', function(email){
      var gravatar = require('gravatar');
      return gravatar.url(email, {s: 49});
  });

 let knex = this.get('knex');
 let MenuModel = require('./modules/setting/models/menu.js');
 let mM = new MenuModel({knex: knex});

 // @todo move 'main'
 let _this = this;
 mM.getByName('main', function(err, menuItems){
   if(err) {
     return console.log(err);
   }

   _this._nunjucksEnv.addGlobal('_menuItems', menuItems);
 });

  this._nunjucksEnv.addGlobal('system', {
    navigations: require('./navigations')
  });

}

drafterbit._initAppLogger = function() {

  let winstonKnex = require('./winston/transports/knex')

  let appLogger = new (winston.Logger)({
    transports: [
      new (winston.transports.Knex)({ tableName: 'logs', knexInstance: this.get('knex')  })
    ]
  });

  this.set('appLogger', appLogger);
}

drafterbit._initDB = function(){
  let knex = require('knex')(this._CONFIG.db);
  this.set('knex', knex);
}

drafterbit._initConfig = function() {
  let p = path.join(this._ROOT, 'config.js');
  if(fs.accessSync(p, fs.constants.F_OK)) {
    throw new Error("You must create config.js in your project root director");
  }

  // @todo validate config
  this._CONFIG = require(p);
  this.set('_CONFIG', this._CONFIG);
  this.set('secret', this._CONFIG.secret);
  this.set('permissions', this._CONFIG.permissions);
}

drafterbit._initRoutes = function() {
  // @todo add route priority options
  for(var name in this._modules) {
    var routes = this._modules[name].getRoutes();
    if(routes) {
      this.use('/', routes);
    }
  }
}

drafterbit._initModules = function(){

  // create main/fallback module first
  class mainModule extends Module {
      getName() {
          // return config.mainModuleName;
          return "__main__";
      }
  }

  var mM = new mainModule(this);
  mM.dirname = this._ROOT;
  this._modules[mM.getName()] = mM;

  for(var i=0;i<this._modulePaths.length;i++){

    if(_isRelative(this._modulePaths[i])) {
      var rP = path.resolve(this._ROOT, this._modulePaths[i]);
      var moduleF = require(rP);
      var m = new moduleF(this);
      m.resolvedPath = rP;

    } else if(path.isAbsolute(this._modulePaths[i])) {
      var moduleF = require(this._modulePaths[i]);
      var m = new moduleF(this);
      m.resolvedPath = this.modulePaths[i];

    } else {
      var moduleF = require(this.modulePaths[i]);
      var m = new moduleF(this);
      m.resolvedPath = require.resolve(this.modulePaths[i]);
    }

    if(fs.lstatSync(m.resolvedPath).isDirectory()) {
      m.dirname = m.resolvedPath;
    } else {
      m.dirname = path.dirname(m.resolvedPath);
    }

    // @todo validate name
    this._modules[m.getName()] = m;
  }
}

export default drafterbit;
