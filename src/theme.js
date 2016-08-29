var Obj = require('./object');
var path = require('path');

module.exports = Obj.extend({

  init: function(themeManager) {

  },

  _getDir: function(){
    if(typeof this.dirname === 'undefined') {
      throw Error("Theme is not yet initialized")
    }

    return this.dirname;
  },

  getName: function() {
    throw Error("Theme on "+this.dirname+" do not have 'getName' method.");
  },

  getViewPath: function() {
     return path.join(this._getDir(), 'views');
  },

  getPublicPath: function(){
    return path.join(this._getDir(), 'public');
  },

  getPreviewImage: function() {
    return 'screenshot.png';
  }

});
