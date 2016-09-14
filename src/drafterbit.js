var path = require('path');
var fs = require('fs');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var session = require('express-session');
var flash = require('connect-flash');
var express = require('express');
var expressJWT = require('express-jwt');
var expressValidator = require('express-validator');
var winston = require('winston');

var Module = require('./module');
var nunjucksModuleLoader = require('./nunjucks/module-loader');

var jwt = require('jsonwebtoken');

module.exports = function(root, app){

    var config = [];
    app.set('secret', config.secret);
    app.set('permissions', config.permissions);

    var _modules = [];
    var _boot = function(paths) {
        config = _initConfig();
        _initModules(paths);
        _initDB();
        _initAppLogger();
        var nunjucksEnv = _initViews();
        _initBaseMiddlewares();
        _initStaticMiddlewares();
        _initSecurityMiddleware();

        // add req user to nunjucks env as global
        app.use(function(req, res, next){
          try {
            if(req.user) {
              nunjucksEnv.addGlobal('user', req.user);
              nunjucksEnv.addGlobal('_jwtToken', req.session.JWToken);
            }
          } catch (e) {
            console.log(e);
          }
          next();
        });

        _initRoutes();
        _initThemes();

        // not found handle
        app.use(function(req, res, next) {
          var err = new Error('Not Found');
          err.status = 404;
          next(err);
        });

        _initErrorhandler();
        return true;
    }

    var _initConfig = function() {
      return require(path.join(root, 'config.js'));
    }

    var _initThemes =  function(){
      var ThemeManager = require('./theme-manager');
      var themeManager = new ThemeManager(root);

      app.set('themeManager', themeManager);
    }

    var _initAppLogger = function() {

      winstonKnex = require('./winston/transports/knex')

      var appLogger = new (winston.Logger)({
        transports: [
          new (winston.transports.Knex)({ tableName: 'logs', knexInstance: app.get('knex')  })
        ]
      });

      app.set('appLogger', appLogger);
    }

    var _initStaticMiddlewares = function() {
      for(var name in _modules) {
          app.use('/'+name, express.static( _modules[name].getPublicPath()));
      }
    }

    var _initSecurityMiddleware = function(){
      // JWT simple auth setup, we redirect unauthorized to login page
      // @todo move secret to config
      app.use(/^\/desk/,expressJWT({
          secret: config.secret,
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

      app.use(function (err, req, res, next) {

          // @todo check if request is ajax and return json
        if (err.name === 'UnauthorizedError') {
          res.redirect('/login');
        } else {
           // @why this is not executed ??
           // console.log(req.user);
        }
      });
    }

    var _initBaseMiddlewares = function() {
      app.use(logger('dev'));
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      app.use(expressValidator());
      app.use(cookieParser());
      app.use(express.static(path.join(root, 'public')));
      app.use('/bower_components', express.static(path.join(root, 'bower_components')));

      app.use(session({ secret: config.secret })); // session secret
      app.use(flash()); // use connect-flash for flash messages stored in session
    }

    var _initDB = function(){
      var knex = require('knex')(config.db);
      app.set('knex', knex);
    }

    var _initErrorhandler = function() {
      if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error.html', {
            message: err.message,
            error: err
          });
        });
      }

      // production error handler
      // no stacktraces leaked to user
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
          message: err.message,
          error: {}
        });
      });
    }

    var _isRelative = function(filename) {
        return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
    }

    var _initRoutes = function() {
      // @todo add route priority options
      for(var name in _modules) {
        var routes = _modules[name].getRoutes();
        if(routes) {
          app.use('/', routes);
        }
      }
    }

    var _initViews = function() {
      // init view
      var viewPaths = [root+'/views'];
      var nunjucksEnv = new nunjucks.Environment(
          new nunjucksModuleLoader(_modules, {paths: viewPaths}),
          {
              autoescape: false
          }
      );
      nunjucksEnv.express(app);
      nunjucksEnv.addGlobal('__', function(s){
        // @todo translation
            return s;
        })
      nunjucksEnv.addGlobal('isExists', function(el, arr){
        return arr.indexOf(el) !== -1;
      })
      nunjucksEnv.addGlobal('gravatar', function(email){
            var gravatar = require('gravatar');
            return gravatar.url(email, {s: 49});
        });

       var knex = app.get('knex');
       var MenuModel = require('./modules/setting/models/menu.js');
       var mM = new MenuModel({knex: knex});

       // @todo move 'main'
       mM.getByName('main', function(err, menuItems){
         if(err) {
           return console.log(err);
         }

         nunjucksEnv.addGlobal('_menuItems', menuItems);
       });

      // @todo move this to config
      nunjucksEnv.addGlobal('system', {
          navigations: require('./navigations')
        });

        return nunjucksEnv;
    }

    var _initModules = function(paths){

      // create main/fallback module first
      var mainModule = Module.extend({
          getName: function() {
              return config.mainModuleName;
          }
      });

      var mM = new mainModule(app);
      mM.dirname = root;
      _modules[mM.getName()] = mM;

      for(var i=0;i<paths.length;i++){

        if(_isRelative(paths[i])) {
          var rP = path.resolve(root, paths[i]);
          var moduleF = require(rP);
          var m = new moduleF(app);
          m.resolvedPath = rP;

        } else if(path.isAbsolute(paths[i])) {
          var moduleF = require(paths[i]);
          var m = new moduleF(app);
          m.resolvedPath = paths[i];

        } else {
          var moduleF = require(paths[i]);
          var m = new moduleF(app);
          m.resolvedPath = require.resolve(paths[i]);
        }

        if(fs.lstatSync(m.resolvedPath).isDirectory()) {
          m.dirname = m.resolvedPath;
        } else {
          m.dirname = path.dirname(m.resolvedPath);
        }

        // @todo validate name
        _modules[m.getName()] = m;
      }
    }

    return {
      boot: function() {

          if(this.registerModules === undefined) {
            throw Error("Drafterbit app must declare registerModules method before boot");
          }

          var modulePaths =  this.registerModules();
          return _boot(modulePaths);
      },
      getModules: function() {
        return _modules;
      },
      getModule: function(name) {
        return _modules[name];
      },
    }
};