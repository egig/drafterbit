'use strict';

var Module = require('./../../module');

var BlogModule = Module.extend({
  getName: function getName() {
    return 'blog';
  }
});

module.exports = BlogModule;