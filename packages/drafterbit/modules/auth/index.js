const Module = require('../../Module');

class AuthModule extends Module {
    constructor(app) {
        super(app);

        this.selectFields = {
            'User': ['-__v', '-password']
        };
    }

    registerClientConfig(serverConfig) {
        return {
            userApiBaseURL: serverConfig.get('USER_API_BASE_URL'),
            userApiKey: serverConfig.get('USER_API_KEY')
        };
    }
}


module.exports = AuthModule;