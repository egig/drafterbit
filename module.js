var Obj = require('./object');
var path = require('path');

module.exports = Obj.extend({

  init: function(app) {

  },

  _getDir: function(){
    if(typeof this.dirname === 'undefined') {
      throw "Module is not yet initialized"
    }

    return this.dirname;
  },

  getName: function() {
    throw "Module do not have 'getName' method.";
  },

  getViewPath: function() {
     return path.join(this._getDir(), 'views');
  },

  getRoutesPath: function() {
     return path.join(this._getDir(), 'routes');
  },

  getRoutes: function() {
     return require(this.getRoutesPath());
  },

  getPublicPath: function(){
    return path.join(this._getDir(), 'public');
  },

  getMigrationPath: function(){
    return path.join(this._getDir(), 'migrations');
  },

  getSeedPath: function(){
    return path.join(this._getDir(), 'seeds');
  }

});
