const path = require('path');
const fs = require('fs');

class Module {

    #path = '';
    #app = null;

    /**
     *
     * @param app drafterbit app instance
     */
    constructor(app) {
        this.#app = app;
    }

    /**
     *
     * @param p
     */
    setPath(p) {
        this.#path = p;
    }

    /**
     * Load Routes to app
     */
    loadRoutes() {
        if (this.canLoad('routes')) {
            let routes = this.require('routes');
            this.#app.use(routes);
        }
    }

    /**
     * Load commands to app
     */
    loadCommands() {
        if (this.canLoad('commands')) {
            let commands = this.require('commands');
            commands.map(c => {
                this.#app.get('cmd').command(c.command)
                    .description(c.description)
                    .action(c.createAction(this.#app));
            });
        }
    }

    /**
     *
     * @param file
     * @returns {any}
     */
    require(file) {
        return require(path.join(this.#path, file));
    }

    /**
     *
     * @param db
     */
    registerSchema(db) {}

    /**
     *
     * @param serverConfig
     * @returns {{}}
     */
    registerClientConfig(serverConfig) {
        return {};
    }

    /**
     *
     * @returns {string|boolean}
     */
    getAdminClientSideEntry() {
        let entryPath = this.#path+'/client-side/src/index.js';
        if (fs.existsSync(entryPath)) {
            return entryPath;
        }

        return false;
    }

    /**
     *
     * @param files
     * @returns {boolean}
     */
    canLoad(files) {
        let resolvingPath = path.join(this.#path,files);
        try {
            require.resolve(resolvingPath);
            return true;
        } catch (e) {
            if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
                return false;
            } else {
                throw e;
            }
        }
    }

    /**
     *
     * @param filename
     * @returns {boolean}
     * @private
     */
    static _isRelative(filename) {
        return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
    }

    /**
     *
     * @param filePath
     * @returns {boolean}
     */
    static isDTModule(filePath) {
        return (filePath.indexOf('drafterbit') === 0);
    }

    /**
     *
     * @param filePath
     * @param root
     * @returns {void | string|string|*}
     */
    static resolve(filePath, root) {
        if(Module.isDTModule(filePath)){
            return filePath.replace(/^drafterbit/gi, __dirname);
        }

        if(path.isAbsolute(filePath)) {
            return filePath;
        }

        if(Module._isRelative(filePath)) {
            return path.resolve(root, filePath);
        }

        try {
            return path.dirname(require.resolve(filePath));
        } catch (e) {
            if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
                return filePath;
            } else {
                throw e;
            }
        }
    }

    /**
     *
     * @param app
     * @returns {Promise<[unknown]>}
     */
    install(app) {
        return Promise.all([]);
    }
}

module.exports = Module;