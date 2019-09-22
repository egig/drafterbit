const routes  = require('./routes');
const contentTypeMiddleware  = require('./middlewares/contentType');

class ContentModule {
    constructor(app) {
        app.on('boot', () => {
            app.use(contentTypeMiddleware());
        });
    
        app.on('routing', () => {
            app.use(routes);
        });
    }

    getAdminClientEntry() {
        return this._modulePath+'/admin/client/src/index.js';
    }
}

module.exports = ContentModule;