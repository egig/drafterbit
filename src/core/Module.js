const path = require('path');

class Module {
    constructor(manager) {
        this.manager = manager;
    }

    boot() {
        //..
    }

    _getDir(){
        if(typeof this.dirname === 'undefined') {
            throw 'Module is not yet initialized';
        }

        return this.dirname;
    }

    getName() {
        return path.basename(this._getDir());
    }

    getModelPath() {
        return path.join(this._getDir(), 'models');
    }

    getRoutesPath() {
        return path.join(this._getDir(), 'routes');
    }

    getRoutes() {
	    return require(this.getRoutesPath());
    }
}

module.exports = Module;