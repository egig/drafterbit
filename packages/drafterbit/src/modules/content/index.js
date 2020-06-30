const routes  = require('./routes');
const TypeSchema  = require('./models/Type');

class ContentModule {
    constructor(app) {
        app.on('routing', () => {
            app.use(routes);
        });
    }

    registerSchema(db) {
        db.model('Type', TypeSchema, '_types');
    }

    getAdminClientEntry() {
        return this._modulePath+'/client/src/index.js';
    }
}

module.exports = ContentModule;