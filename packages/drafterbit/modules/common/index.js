const Module = require('../../Module');

class CommonModule extends Module {

    constructor(app) {
        super(app);
        //
        // app.on('routing', function () {
        //     app.use(routes);
        // });
    }
}

module.exports = CommonModule;