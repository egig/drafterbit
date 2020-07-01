const routes  = require('./routes');
const Module = require('../../Module');

class SwaggerModule extends Module {
    constructor(app) {
        super(app)
        app.on('routing', () => {
            app.use(routes);
        });
    }

    getAdminClientEntry() {
        return this._modulePath+'/client/src/index.js';
    }
}

module.exports = SwaggerModule;