var Panel = require('../panel');

module.exports = Panel.extend({

  getName: function(){
    return 'TextPanel';
  },

  getView: function() {
    return "Test get view from panel";
  }
});
