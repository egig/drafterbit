const Obj = require('./object');
const path = require('path');

module.exports = Obj.extend({

  init() {

  },

  _getDir(){
    if(typeof this.dirname === 'undefined') {
      throw Error("Theme is not yet initialized")
    }

    return this.dirname;
  },

  getName() {
    throw Error("Theme on "+this.dirname+" do not have 'getName' method.");
  },

  getViewPath() {
     return path.join(this._getDir(), 'views');
  },

  getPublicPath(){
    return path.join(this._getDir(), 'public');
  },

  getPreviewImage() {
    return 'screenshot.png';
  }

});
