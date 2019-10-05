const routes  = require('./routes');
const contentTypeMiddleware  = require('./middlewares/contentType');
const ContentTypeSchema  = require('./models/ContentType');

class ContentModule {
    constructor(app) {
        app.on('boot', () => {
            // app.use(contentTypeMiddleware());
        });
    
        app.on('routing', () => {
            app.use(routes);
        });
    }

    registerSchema(db) {
        db.model(`ContentType`, ContentTypeSchema, '_content_types');
    }

    getAdminClientEntry() {
        return this._modulePath+'/admin/client/src/index.js';
    }
}

module.exports = ContentModule;