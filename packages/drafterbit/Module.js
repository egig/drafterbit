class Module {

    constructor(app) {
    }

    config() {}

    registerSchema(db) {}

    registerClientConfig(serverConfig) {
        return {};
    }

    getAdminClientSideEntry() {
        return this._modulePath+'/client-side/src/index.js';
    }
}

module.exports = Module;