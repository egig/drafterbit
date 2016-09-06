var Model = require('../../../model');

var MenuModel = Model.extend({
  getAll: function(callback) {

    var _this = this;
    this.knex('menus').select('*').then(function(menus){

      IterateOver(menus, function(menu, report) {

          _this.knex('menu_items').select('*').where('menu_id', menu.id)
            .then(function(menuItems) {

              menu.items = menuItems;
              report();
            })

      }, function() {
        callback(null, menus);
      });

    }).catch(function(e){
      callback(e);
    });
  }
})


// @link http://mostafa-samir.github.io/async-iterative-patterns-pt1/
function IterateOver(list, iterator, callback) {

    var doneCount = 0;
    function report() {
        doneCount++;

        if(doneCount === list.length) {
          callback();
        }
    }

    // here we give each iteration its job
    for(var i = 0; i < list.length; i++) {
        // iterator takes 2 arguments, an item to work on and report function
        iterator(list[i], report)
    }
}

module.exports = MenuModel;
