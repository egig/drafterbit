var Module = require('./../../module');

module.exports = Module.extend({

  _theme: null,
  init: function(app) {

    // @todo create theme manager
    this._theme = 'feather';
  },

  getName: function() {
      return 'theme';
  },

  getViewPath() {
    // @todo get this from theme manager
    return __dirname+'/../../themes/'+this._theme+'/views';
  },

  getPublicPath() {
    // @todo get this from theme manager
    return __dirname+'/../../themes/'+this._theme+'/public';
  }

});
