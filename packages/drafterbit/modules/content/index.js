const routes  = require('./routes');
const TypeSchema  = require('./models/Type');
const Module = require('../../Module');

class ContentModule extends Module {
    constructor(app) {
        super(app);
        app.on('routing', () => {
            app.use(routes);
        });
    }

    registerSchema(db) {
        db.model('Type', TypeSchema, '_types');
    }
}

module.exports = ContentModule;