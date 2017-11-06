class ModuleManager {

	constructor(app) {
		this._app = app;
		this._modules = [];
	}

	registerModule(application) {
		this._modules.push(application);
	}

	initialize() {
		this._modules.map((module) => {
			this._app.use(module.getPrefix(), module.getRoutes());
		})
	}
}

export default ModuleManager;