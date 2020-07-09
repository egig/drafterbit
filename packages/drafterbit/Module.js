const path = require('path');

class Module {

    constructor(app) {
        this.app = app;
    }

    loadRoutes() {
        try {
            let routes = require(this._modulePath+"/routes");
            this.app.use(routes)
        } catch (ex) {
            //..
        }
    }

    config() {}

    registerSchema(db) {}

    registerClientConfig(serverConfig) {
        return {};
    }

    getAdminClientSideEntry() {
        return this._modulePath+'/client-side/src/index.js';
    }

    static _isRelative(filename) {
        return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
    }

    static isDTModule(filePath) {
        return (filePath.indexOf('drafterbit') === 0);
    }

    static resolve(filePath, root) {
        if(Module.isDTModule(filePath)){
            return filePath.replace(/^drafterbit/gi, __dirname)
        }

        if(path.isAbsolute(filePath)) {
            return filePath
        }

        if(Module._isRelative(filePath)) {
            return path.resolve(root, filePath);
        }

        // TODO ensure this return path across OS
        try {
            return path.dirname(require.resolve(filePath));
        } catch (e) {
            if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
                return filePath;
            } else {
                throw e;
            }
        }
    };
}

module.exports = Module;