var Module = require('./../../module')

var BlogModule = Module.extend({
  getName: function(){
   return 'blog';
  }
})

module.exports = BlogModule;
