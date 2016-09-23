const path = require('path');

let _isRelative = function(filename) {
    return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
}

class ModulePathResolver {
  constructor(root) {
    this._root = root;
  }

  resolve(m) {

    if(path.isAbsolute(m)) {
      return m;
    }

    if(_isRelative(m)) {
      return path.resolve(this._root, m);
    }

    // @todo ensure this return path across OS
    return require.resolve(m)
  }

}

module.exports = ModulePathResolver
