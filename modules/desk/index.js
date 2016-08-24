var drafterbit = require('./../../../drafterbit');

module.exports = drafterbit.Module.extend({

  init: function(app) {

    var PanelManager = require('./panel-manager');
    var pM = new PanelManager();

    var TextPanel = require('./panels/text-panel')
    var tP = new TextPanel;
    pM.registerPanelType(tP.getName(), tP);

    app.set('panelManager', pM);
  },

  getName: function() {
      return 'desk';
  }
});
