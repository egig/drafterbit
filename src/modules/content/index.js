const routes  = require('./routes');
const projectMiddleware  = require('./middlewares/project');

class ContentModule {
    constructor(app) {
        app.on('boot', () => {
            app.use(projectMiddleware());
        });
    
        app.on('routing', () => {
            app.use(routes);
        });
    }

    getAdminClientEntry() {
        return this._modulePath+'/client/index.js';
    }
}

module.exports = ContentModule;