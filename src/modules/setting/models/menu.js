var Model = require('../../../model');

var MenuModel = Model.extend({
  getAll: function(callback) {
    this.knex('menus').select('*').then(function(menus){

      // @get items ?
      callback(null, menus)
    }).catch(function(e){
      callback(e);
    });
  }
})

module.exports = MenuModel;
