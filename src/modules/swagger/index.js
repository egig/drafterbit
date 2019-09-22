const routes  = require('./routes');

class SwaggerModule {
    constructor(app) {
    
        app.on('routing', () => {
            app.use(routes);
        });
    }

    getAdminClientEntry() {
        return this._modulePath+'/client/index.js';
    }
}

module.exports = SwaggerModule;