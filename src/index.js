var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./drafterbit');
var express = require('express');

function createApplication(_ROOT) {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  app.request = { __proto__: express.request, app: app };
  app.response = { __proto__: express.response, app: app };
  app.init();
  return app;
}

exports = module.exports = createApplication;
exports.Module = require('./module');
