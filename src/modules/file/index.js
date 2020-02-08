const routes  = require('./routes');

class FileModule {
    constructor(app) {
        app.on('routing', () => {
            app.use(routes);
        });
    }

    // registerSchema(db) {
    //     db.model('User', UserSchema, '_users');
    // }
    //
    getAdminClientEntry() {
        return this._modulePath+'/client/src/index.js';
    }
    //
    registerConfig(config) {

        config.use('file_module', {
            type: 'literal',
            store: {
                'FILES_BASE_PATH': './files'
            }
        });
    }
}

module.exports = FileModule;