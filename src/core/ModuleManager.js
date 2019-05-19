import fs from 'fs';
import path from 'path';
import ModulePathResolver from './ModulePathResolver';

export default class ModuleManager {

	constructor(root, app) {
		this._ROOT = root;
		this.app = app;
		this._models = [];
		this._modules = [];
		this._modulePaths = [];
	}

	setModulePaths(modulePaths) {
		this._modulePaths = modulePaths;
	}

	/**
	 * Initialize modules.
	 *
	 * @private
	 */
	init(){

		this._modulePathResolver = new ModulePathResolver(this._ROOT);

		for(let i=0;i<this._modulePaths.length;i++){

			let rP = this._modulePathResolver.resolve(this._modulePaths[i]);
			let moduleF = require(rP);;
			let m = new moduleF(this);
			m.resolvedPath = rP;

			if(fs.lstatSync(m.resolvedPath).isDirectory()) {
				m.dirname = m.resolvedPath;
			} else {
				m.dirname = path.dirname(m.resolvedPath);
			}

			// @todo validate name
			this._modules[m.getName()] = m;
		}
	}

	getModel(name) {

		let connection = this.app.get('db');

		if(typeof connection == 'undefined') {
			throw new Error("Can not create model without db connection");
		}

		if(typeof this._models[name] !== 'undefined') {
			return this._models[name];
		}

		if(name.indexOf('@') === 0) {
			let tmp = name.split('/');
			let module = tmp.shift().substr(1);

			if(!this._modules[module]) {
				throw Error("Unregistered module: '"+module+"'");
			}

			let basePath = this._modules[module].getModelPath();
			let fName =  tmp.join('/');

			name = path.join(basePath, fName);
		}

		let ModelSchema = require(name);

		let modelName = path.basename(name);
		this._models[name] = connection.model(modelName, ModelSchema);

		return this._models[name];
	}
}