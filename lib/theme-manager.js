'use strict';

var ThemeManager = function ThemeManager(root) {

  var ModulePathResolver = require('./module-path-resolver');
  this._modulePathResolver = new ModulePathResolver(root);
};

ThemeManager.prototype._themes = [];
ThemeManager.prototype._themesByName = [];
ThemeManager.prototype.getThemes = function () {
  return this._themes;
};

ThemeManager.prototype.addThemePath = function (themePath) {
  var p = this._modulePathResolver.resolve(themePath);
  var T = require(p);
  var t = new T(this);
  t.dirname = p;
  this._themesByName[t.getName()] = t;
  this._themes.push(t);
};

ThemeManager.prototype.getTheme = function (n) {
  return this._themesByName[n];
};

module.exports = ThemeManager;