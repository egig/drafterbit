var Obj = require('./object');

module.exports = Obj.extend({
  knex: null,
  init: function(options) {
    this.knex = options.knex;
  }
})
