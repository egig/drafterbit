'use strict';

var Module = require('./../../module');

module.exports = Module.extend({

  _theme: null,
  init: function init(app) {

    // @todo create theme manager
    this._theme = 'feather';
  },

  getName: function getName() {
    return 'theme';
  },

  getViewPath: function getViewPath() {
    // @todo get this from theme manager
    return __dirname + '/../../themes/' + this._theme + '/views';
  },
  getPublicPath: function getPublicPath() {
    // @todo get this from theme manager
    return __dirname + '/../../themes/' + this._theme + '/public';
  }
});