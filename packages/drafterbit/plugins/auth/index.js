const Plugin = require('../../Plugin');
const install = require('./install');

class AuthPlugin extends Plugin {
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

    install(app) {
        return install(app);
    }
}


module.exports = AuthPlugin;