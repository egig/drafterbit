var path = require('path');

var ModulePathResolver = function(root){
  this._root = root;
}

ModulePathResolver.prototype.resolve = function(m) {

  if(path.isAbsolute(m)) {
    return m;
  }

  if(_isRelative(m)) {
    return path.resolve(this._root, m);
  }

  // @todo ensure this return path across OS
  return require.resolve(m)
}

var _isRelative = function(filename) {
    return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
}

module.exports = ModulePathResolver
