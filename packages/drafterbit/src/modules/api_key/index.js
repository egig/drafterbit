const apiKeyMiddleware = require('./middlewares/apiKey');
const routes = require('./routes');
const ApiKeySchema  = require('./models/ApiKey');

class AuthModule {
    constructor(app) {
        app.on('boot', () => {
            app.use(apiKeyMiddleware());
        });

        app.on('routing', () => {
            app.use(routes);
        });
    }

    registerSchema(db) {
        db.model('ApiKey', ApiKeySchema, '_api_keys');        
    }

    getAdminClientEntry() {
        return this._modulePath+'/client/src/index.js';
    }

    config() {
        return {
            'ADMIN_API_KEY': 'test',
            'api_key_exclude_pattern': [
                '^\/$',
                '^\/(css|js|img|fonts|locales)\/(.+)',
                '^/favicon.ico',
                '/swagger.json'
            ]
        }
    }
}

module.exports = AuthModule;