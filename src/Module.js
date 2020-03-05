class Module {

    constructor(app) {}

    config() {}


    registerSchema(db) {}

    registerClientConfig(serverConfig) {
        return {}
    }

    getAdminClientEntry() {
        return ""
    }
}

module.exports = Module;