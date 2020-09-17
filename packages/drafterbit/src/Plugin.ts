import path from 'path';

class Plugin {

    private _path: string = '';
    private readonly _app: any;

    /**
     *
     * @param app drafterbit app instance
     */
    constructor(app: any) {
        this._app = app;
    }

    /**
     *
     * @param p
     */
    setPath(p: string): void {
        this._path = p;
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
    canLoad(files: string) {
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
            if (e instanceof Error && (e as any).code === 'MODULE_NOT_FOUND') {
                return filePath;
            } else {
                throw e;
            }
        }
    }
}

export = Plugin