"use strict";

module.exports = function () {

  var _panels = [];

  return {
    registerPanelType: function registerPanelType(name, panel) {
      _panels[name] = panel;
    },

    /**
     * Get panel by name
     */
    getPanel: function getPanel(name) {
      return _panels[name];
    }
  };
};