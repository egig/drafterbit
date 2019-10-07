const routes  = require('./routes');
const UserSchema  = require('./models/User');

class UserModule {
    constructor(app) {
        app.on('routing', () => {
            app.use(routes);
        });
    }

    registerSchema(db) {
        db.model('User', UserSchema, '_users');
    }

    getAdminClientEntry() {
        return this._modulePath+'/admin/client/src/index.js';
    }
}

module.exports = UserModule;