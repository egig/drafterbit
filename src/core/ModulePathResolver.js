const path = require('path');

class ModulePathResolver {
    constructor(root) {
        this._root = root;
    }

    static _isRelative(filename) {
        return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
    }

    resolve(m) {

        if(path.isAbsolute(m)) {
            return m;
        }

        if(ModulePathResolver._isRelative(m)) {
            return path.resolve(this._root, m);
        }

        // @todo ensure this return path across OS
        return require.resolve(m);
    }
}

module.exports = ModulePathResolver;