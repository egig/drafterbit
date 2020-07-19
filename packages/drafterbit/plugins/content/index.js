const TypeSchema  = require('./models/Type');
const Plugin = require('../../Plugin');

class ContentPlugin extends Plugin {
    constructor(app) {
        super(app);
    }

    registerSchema(db) {
        db.model('Type', TypeSchema, '_types');
    }
}

module.exports = ContentPlugin;