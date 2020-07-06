const apiKeyMiddleware = require('./middlewares/apiKey');
const routes = require('./routes');
const ApiKeySchema  = require('./models/ApiKey');
const Module = require('../../Module');

class AuthModule extends Module {
    constructor(app) {
        super(app);
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

    config() {
        return {
            'ADMIN_API_KEY': 'test',
            'api_key_exclude_pattern': [
                '^\/$',
                '^\/(css|js|img|fonts|locales)\/(.+)',
                '^/favicon.ico',
                '/swagger.json'
            ]
        };
    }
}

module.exports = AuthModule;