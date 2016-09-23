'use strict';

var Panel = require('../panel');

module.exports = Panel.extend({

  getName: function getName() {
    return 'TextPanel';
  },

  getView: function getView() {
    return "Test get view from panel";
  }
});