const apiKeyMiddleware = require('./middlewares/apiKey');
const routes = require('./routes');

class AuthModule {
    constructor(app) {
        app.on('boot', () => {
            app.use(apiKeyMiddleware());
        });

        app.on('routing', () => {
            app.use(routes);
        });
    }

    getAdminClientEntry() {
        return this._modulePath+'/admin/client/src/index.js';
    }
}

module.exports = AuthModule;