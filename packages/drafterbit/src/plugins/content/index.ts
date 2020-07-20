const TypeSchema  = require('./models/Type');
import Plugin from '../../Plugin';
import mongoose from 'mongoose';

class ContentPlugin extends Plugin {

    registerSchema(db: mongoose.Connection) {
        db.model('Type', TypeSchema, '_types');
    }
}

module.exports = ContentPlugin;