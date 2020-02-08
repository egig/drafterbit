const routes  = require('./routes');
const UserSchema  = require('./models/User');

class UserModule {
    constructor(app) {
        app.on('routing', () => {
            app.use(routes);
        });
    }

    registerSchema(db) {
        db.model('User', UserSchema, '_users');
    }

    getAdminClientEntry() {
        return this._modulePath+'/client/src/index.js';
    }

    registerConfig(config) {

        config.use('user', {
            type: 'literal',
            store: {
                'USER_API_BASE_URL': '/',
                'USER_API_KEY': '',
            }
        });
    }

    registerClientConfig(serverConfig) {
        return {
            userApiBaseURL: serverConfig.get('USER_API_BASE_URL'),
            userApiKey: serverConfig.get('USER_API_KEY')
        };
    }
}

module.exports = UserModule;