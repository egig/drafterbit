'use strict';

var Obj = require('./object');

module.exports = Obj.extend({
  knex: null,
  init: function init(options) {
    this.knex = options.knex;
  }
});