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

  getRoutes: function() {
     if(typeof this.dirname === 'undefined') {
       throw "Module is not yet initialized"
     }

     return require(path.join(this.dirname, 'routes'));
  },

  getPublicPath: function(){
    if(typeof this.dirname === 'undefined') {
      throw "Module is not yet initialized"
    }

    return path.join(this.dirname, 'public');
  }

});
