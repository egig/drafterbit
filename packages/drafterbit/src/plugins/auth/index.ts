import Application from "../../Application";
import Plugin from '../../Plugin';
import Config from '../../Config';
const install = require('./install');


class AuthPlugin extends Plugin {

    selectFields: Object;

    constructor(app: Application) {
        super(app);

        this.selectFields = {
            'User': ['-__v', '-password']
        };
    }

    registerClientConfig(serverConfig: Config) {
        return {
            userApiBaseURL: serverConfig.get('USER_API_BASE_URL'),
            userApiKey: serverConfig.get('USER_API_KEY')
        };
    }

    install(app: Application) {
        return install(app);
    }
}


module.exports = AuthPlugin;