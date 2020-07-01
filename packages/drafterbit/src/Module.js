class Module {

    constructor(app) {
    }

    config() {}

    registerSchema(db) {}

    registerClientConfig(serverConfig) {
        return {};
    }

    getAdminClientEntry() {
        return this._modulePath+'/client/src/index.js';
    }
}

module.exports = Module;