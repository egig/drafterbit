import path from 'path';
import Application from "./Application";

class Plugin {

    private readonly _path: string;
    private readonly _app: any;

    /**
     *
     * @param app drafterbit app instance
     * @param p string
     * @Final
     */
    constructor(app: any, p: string) {
        this._app = app;
        this._path = p;

        app.on('boot', this.onBoot)
    }

    get app() {
        return this._app;
    }

    getPath(): string {
        return this._path;
    }

    /**
     * Load Routes to app
     */
    loadRoutes(): void {
        if (this.canLoad('routes')) {
            let router = this.require('routes');
            this._app.use(router.routes());
        }
    }

    /**
     * Load commands to app
     */
    loadCommands() {
        if (this.canLoad('commands')) {
            let commands = this.require('commands');
            commands(this._app.get('cmd'), this._app)
        }
    }

    loadConfig() {
        if (this.canLoad('config')) {
            this._app.config.registerConfig(this.require('config'));
        }
    }

    /**
     *
     * @param file
     * @returns {any}
     */
    require(file: string): any {
        let p: string = path.join(this._path, file);
        return require(p);
    }

    /**
     *
     * @param files
     * @returns {boolean}
     */
    canLoad(files: string): boolean {
        let resolvingPath = path.join(this._path,files);
        try {
            require.resolve(resolvingPath);
            return true;
        } catch (e) {
            if (e instanceof Error && (e as any).code === 'MODULE_NOT_FOUND') {
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
    static _isRelative(filename: string): boolean {
        return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
    }

    /**
     *
     * @param filePath
     * @returns {boolean}
     */
    static isDTPlugin(filePath: string): boolean {
        return (filePath.indexOf('drafterbit') === 0);
    }

    /**
     *
     * @param filePath
     * @param root
     * @returns {void | string|string|*}
     */
    static resolve(filePath: string, root: string): void | string | string | any {
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
            if (e instanceof Error && (e as any).code === 'MODULE_NOT_FOUND') {
                return filePath;
            } else {
                throw e;
            }
        }
    }

    onBoot(app: Application) {

    }
}

export = Plugin