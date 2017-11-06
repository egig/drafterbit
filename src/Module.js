class Module {
    constructor(prefix) {
        this._prefix = prefix;
    }

    getPrefix() {
        return this._prefix;
    }

    getReactRoutes() {
    	return[];
    }
}

export default Module;