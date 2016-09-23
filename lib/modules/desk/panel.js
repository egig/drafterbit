"use strict";

var Obj = require('../../object');

module.exports = Obj.extend({

  _config: [],

  getName: function getName() {
    throw "panel class must have getName method";
  },

  setConfig: function setConfig(config) {
    this._config = config;
  }
});