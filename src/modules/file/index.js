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
        return this._modulePath+'/admin/client/src/index.js';
    }
    //
    registerConfig(config) {

        config.use('file_module', {
            type: 'literal',
            store: {
                'filesBasePath': './files'
            }
        });
    }
    //
    // registerClientConfig(serverConfig) {
    //     return {
    //         userApiBaseURL: serverConfig.get('admin.user_api_base_url'),
    //         userApiKey: serverConfig.get('admin.user_api_key')
    //     };
    // }
}

module.exports = FileModule;