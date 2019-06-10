const BaseModule  = require('../../core/Module');
const authMiddleware = require('./authMiddleware');

class AuthModule extends BaseModule {
    boot() {
        this.manager.app.use(authMiddleware);
    }
}

module.exports = AuthModule;