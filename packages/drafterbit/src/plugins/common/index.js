const Plugin = require('../../Plugin');
const install = require('./install');

class CommonPlugin extends Plugin {
    constructor(app) {
        super(app);
    }

    install(app) {
        return install(app)
    }
}

module.exports = CommonPlugin;