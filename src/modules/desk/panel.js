var Obj = require('../../object');

module.exports = Obj.extend({

  _config: [],

  getName: function() {
    throw "panel class must have getName method"
  },

  setConfig: function(config) {
    this._config = config;
  }
});
