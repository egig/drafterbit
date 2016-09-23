'use strict';

var Obj = require('./object');
var path = require('path');

module.exports = Obj.extend({

  init: function init(themeManager) {},

  _getDir: function _getDir() {
    if (typeof this.dirname === 'undefined') {
      throw Error("Theme is not yet initialized");
    }

    return this.dirname;
  },

  getName: function getName() {
    throw Error("Theme on " + this.dirname + " do not have 'getName' method.");
  },

  getViewPath: function getViewPath() {
    return path.join(this._getDir(), 'views');
  },

  getPublicPath: function getPublicPath() {
    return path.join(this._getDir(), 'public');
  },

  getPreviewImage: function getPreviewImage() {
    return 'screenshot.png';
  }

});