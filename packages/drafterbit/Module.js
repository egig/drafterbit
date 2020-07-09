const path = require('path');
const fs = require('fs');

class Module {

    constructor(app) {
        this.app = app;
        this._modulePath = "";
    }

    loadRoutes() {
        if (this.canLoad('routes')) {
            let routes = this.require('routes');
            this.app.use(routes)
        }
    }

    loadCommands() {
        if (this.canLoad('commands')) {
            let commands = this.require('commands');
            commands.map(c => {
                this.app.get('cmd').command(c.command)
                    .description(c.description)
                    .action(c.createAction(this));
            });
        }
    }

    require(file) {
        return require(path.join(this._modulePath, file));
    }

    registerSchema(db) {}

    registerClientConfig(serverConfig) {
        return {};
    }

    getAdminClientSideEntry() {
        let entryPath = this._modulePath+'/client-side/src/index.js';
        if (fs.existsSync(entryPath)) {
            return entryPath;
        }

        return false;
    }

    canLoad(files) {
        try {
            require.resolve(path.join(this._modulePath,files));
            return true
        } catch (e) {
            if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
                return false;
            } else {
                throw e;
            }
        }
    }

    static _isRelative(filename) {
        return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
    }

    static isDTModule(filePath) {
        return (filePath.indexOf('drafterbit') === 0);
    }

    static resolve(filePath, root) {
        if(Module.isDTModule(filePath)){
            return filePath.replace(/^drafterbit/gi, __dirname)
        }

        if(path.isAbsolute(filePath)) {
            return filePath
        }

        if(Module._isRelative(filePath)) {
            return path.resolve(root, filePath);
        }

        // TODO ensure this return path across OS
        try {
            return path.dirname(require.resolve(filePath));
        } catch (e) {
            if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
                return filePath;
            } else {
                throw e;
            }
        }
    };
}

module.exports = Module;