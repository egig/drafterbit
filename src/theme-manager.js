export default class {

  constructor(root) {

    this._themes = [];
    this._themesByName = [];

    const ModulePathResolver = require('./module-path-resolver');
    this._modulePathResolver = new ModulePathResolver(root);
  }

  getThemes() {
    return this._themes;
  }

  addThemePath(themePath) {
    let p = this._modulePathResolver.resolve(themePath)
    let T = require(p)
    let t = new T(this)
    t.dirname = p;
    this._themesByName[t.getName()] = t;
    this._themes.push(t)
  }

  getTheme(n) {
    return this._themesByName[n];
  }

}
