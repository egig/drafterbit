const Module = require('../../Module');
const install = require('./install');

class CommonModule extends Module {
    constructor(app) {
        super(app);
    }

    install(app) {
        return install(app)
    }
}

module.exports = CommonModule;