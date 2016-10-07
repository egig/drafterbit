var path = require('path');

export default class Module {
  constructor(app) { }

  _getDir(){
    if(typeof this.dirname === 'undefined') {
      throw "Module is not yet initialized"
    }

    return this.dirname;
  }

  getName() {
    throw "Module do not have 'getName' method.";
  }

  getModelPath() {
     return path.join(this._getDir(), 'models');
  }

  getViewPath() {
     return path.join(this._getDir(), 'views');
  }

  getRoutesPath() {
     return path.join(this._getDir(), 'routes');
  }

  getRoutes() {

    try {
      return require(this.getRoutesPath());
    } catch (e) {
      // do nothing, routes is not required

    } finally {
      // do nothing, routes is not required
    }
  }

  getPublicPath() {
    return path.join(this._getDir(), 'public');
  }

  getMigrationPath() {
    return path.join(this._getDir(), 'migrations');
  }

  getSeedPath(){
    return path.join(this._getDir(), 'seeds');
  }
}
