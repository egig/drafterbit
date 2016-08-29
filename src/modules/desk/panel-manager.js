module.exports = function() {

  var _panels = [];

  return {
    registerPanelType: function(name, panel) {
      _panels[name] = panel;
    },

    /**
     * Get panel by name
     */
    getPanel: function(name) {
      return _panels[name];
    }
  }
}
