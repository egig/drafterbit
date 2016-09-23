'use strict';

var Obj = require('./object');
var path = require('path');

module.exports = Obj.extend({

  init: function init(app) {},

  _getDir: function _getDir() {
    if (typeof this.dirname === 'undefined') {
      throw "Module is not yet initialized";
    }

    return this.dirname;
  },

  getName: function getName() {
    throw "Module do not have 'getName' method.";
  },

  getViewPath: function getViewPath() {
    return path.join(this._getDir(), 'views');
  },

  getRoutesPath: function getRoutesPath() {
    return path.join(this._getDir(), 'routes');
  },

  getRoutes: function getRoutes() {

    try {
      return require(this.getRoutesPath());
    } catch (e) {
      // do nothing, routes is not required

    } finally {
      // do nothing, routes is not required
    }
  },

  getPublicPath: function getPublicPath() {
    return path.join(this._getDir(), 'public');
  },

  getMigrationPath: function getMigrationPath() {
    return path.join(this._getDir(), 'migrations');
  },

  getSeedPath: function getSeedPath() {
    return path.join(this._getDir(), 'seeds');
  }

});