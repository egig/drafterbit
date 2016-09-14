var Model = require('../../../model');

var UserModel = Model.extend({
  getAll: function(callback) {
    this.knex('users').select('*').then(function(users){
      callback(null, users)
    }).catch(function(e){
      callback(e);
    });
  }
})

module.exports = UserModel;