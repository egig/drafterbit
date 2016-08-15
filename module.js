var Obj = require('./object');
var path = require('path');

module.exports = Obj.extend({

  getName: function() {
    throw "Module do not have 'getName' method.";
  },

  getViewPath: function() {
     if(typeof this.dirname === 'undefined') {
       throw "Module is not yet initialized"
     }

     return path.join(this.dirname, 'views');
  },

  getRoutesPath: function() {
     if(typeof this.dirname === 'undefined') {
       throw "Module is not yet initialized"
     }

     return path.join(this.dirname, 'routes');
  },

  getRoutes: function() {
     return require(this.getRoutesPath());
  },

  getPublicPath: function(){
    if(typeof this.dirname === 'undefined') {
      throw "Module is not yet initialized"
    }

    return path.join(this.dirname, 'public');
  },

  getMigrationPath: function(){
    if(typeof this.dirname === 'undefined') {
      throw "Module is not yet initialized"
    }

    return path.join(this.dirname, 'migrations');
  },

  getSeedPath: function(){
    if(typeof this.dirname === 'undefined') {
      throw "Module is not yet initialized"
    }

    return path.join(this.dirname, 'seeds');
  }

});
