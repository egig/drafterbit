const path = require('path');

export default class Module {
	constructor(app) {
		this.app = app;
	}

	_getDir(){
		if(typeof this.dirname === 'undefined') {
			throw "Module is not yet initialized"
		}

		return this.dirname;
	}

	getName() {
		return path.basename(this._getDir())
	}

	getModelPath() {
		return path.join(this._getDir(), 'models');
	}

	getRoutesPath() {
		return path.join(this._getDir(), 'routes');
	}

	getRoutes() {

		try {
			return require(this.getRoutesPath());
		} catch (e) {
			return false;
		}
	}
}