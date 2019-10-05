const routes  = require('./routes');
const ContentTypeSchema  = require('./models/ContentType');

class ContentModule {
    constructor(app) {
        app.on('routing', () => {
            app.use(routes);
        });
    }

    registerSchema(db) {
        db.model('ContentType', ContentTypeSchema, '_content_types');
    }

    getAdminClientEntry() {
        return this._modulePath+'/admin/client/src/index.js';
    }
}

module.exports = ContentModule;