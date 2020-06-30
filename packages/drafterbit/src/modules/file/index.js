const routes  = require('./routes');

class FileModule {
    constructor(app) {
        app.on('routing', () => {
            app.use(routes);
        });
    }

    getAdminClientEntry() {
        return this._modulePath+'/client/src/index.js';
    }

    config() {
        return {
            'FILES_BASE_PATH': './files'
        };
    }
}

module.exports = FileModule;