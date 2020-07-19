// @flow
const path = require('path');
const fs = require('fs');

/*::
interface PluginInterface {
    constructor(app: any): void,
    setPath(p: string): void,
    getPath(): string,
    loadRoutes(): void,
    loadCommands(): void,
    require(file: string): any,
}
*/

class Plugin {

    #path: string = '';
    #app: any = null;

    /**
     *
     * @param app drafterbit app instance
     */
    constructor(app: any): void {
        this.#app = app;
    }

    /**
     *
     * @param p
     */
    setPath(p: string): void {
        this.#path = p;
    }


    getPath(): string {
        return this.#path;
    }

    /**
     * Load Routes to app
     */
    loadRoutes(): void {
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
    require(file: string): any {
        let p: string = path.join(this.#path, file);
        return require(p);
    }

    /**
     *
     * @param db
     */
    registerSchema(db: any): any {}

    /**
     *
     * @param serverConfig
     * @returns {{}}
     */
    registerClientConfig(serverConfig: string) {
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
    canLoad(files: string) {
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
    static _isRelative(filename: string) {
        return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
    }

    /**
     *
     * @param filePath
     * @returns {boolean}
     */
    static isDTPlugin(filePath: string) {
        return (filePath.indexOf('drafterbit') === 0);
    }

    /**
     *
     * @param filePath
     * @param root
     * @returns {void | string|string|*}
     */
    static resolve(filePath: string, root: string) {
        if(Plugin.isDTPlugin(filePath)){
            return filePath.replace(/^drafterbit/gi, __dirname);
        }

        if(path.isAbsolute(filePath)) {
            return filePath;
        }

        if(Plugin._isRelative(filePath)) {
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
    install(app: any) {
        return Promise.all([]);
    }
}

module.exports = Plugin;