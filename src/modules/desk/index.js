import Module from './../../module';

class DeskModule extends  Module {

  constructor(app) {
    super();

    var PanelManager = require('./panel-manager');
    var pM = new PanelManager();

    var TextPanel = require('./panels/text-panel')
    var tP = new TextPanel;
    pM.registerPanelType(tP.getName(), tP);

    app.set('panelManager', pM);
  }

  getName(){
   return 'desk';
  }
}

export default DeskModule;
