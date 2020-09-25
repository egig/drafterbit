import fs from 'fs';
import path from 'path';
import Koa from 'koa';

import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Config from './Config';
import Plugin from './Plugin';
import commander from 'commander';
import chokidar from 'chokidar';
import cluster from 'cluster';
import http from 'http'
import nunjucks from 'nunjucks';
import serveStatic from 'koa-static';
import mount from 'koa-mount';
import KoaRouter from '@koa/router';

const packageJson = require('../package.json');


declare namespace Application {
    interface Request extends Koa.Request {
        body: any
    }

    interface Context extends Koa.Context {
        app: Application,
        request: Request
    }

    type Next = Koa.Next
    type Router = KoaRouter

    type Options = {
        plugins?: string[]
        theme?: string
        app_name?: string
        base_url?: string
    }

    type Command = commander.Command
}

const DEFAULT_PORT = 3000;
const DEFAULT_THEME = 'penabulu';
const CONFIG_FILE_NAME = 'drafterbit.config.js';

class Application extends Koa {


    dir: string = "";
    options: Application.Options = {};
    config: Config;

    private _booted: boolean = false;
    private _plugins: Plugin[] = [];

    private _services: any = {};
    private _pluginPaths: string[] = [];
    private _view: nunjucks.Environment | undefined;
    private _logger: Console = console;
    private _theme: string  = DEFAULT_THEME;
    private _server = http.createServer(this.callback());

    constructor(options?: any) {
        // @ts-ignore
        super(options);
        this.config = new Config(options);
    }

    /**
     *
     * @param key
     * @param value
     */
    set(key: string, value: any): void{
        this._services[key] = value;
    }

    /**
     *
     * @param key
     * @returns {*}
     */
    get(key: string): any{
        return this._services[key];
    }

    /**
     *
     * @param view
     * @param options
     */
    render(view: string, options: any) {
        if (typeof this._view === "undefined") {
            throw new Error("_view undefined possibly call render before boot function")
        }
        return this._view.render(view, options);
    }

    /**
     *
     */
    get theme() {
        return this._theme;
    }

    /**
     *
     * @returns {Array}
     */
    get plugins() {
        return this._plugins
    }

    /**
     *
     */
    loadRoutes() {
        this._plugins.map(m => {
            m.loadRoutes();
        });
    }

    start(options: {
        production?: boolean
    } = {}) {
        this.loadRoutes();

        // Close current all connections to fully destroy the server
        const connections: any = {};

        this._server.on('connection', conn => {
            const key = conn.remoteAddress + ':' + conn.remotePort;
            connections[key] = conn;

            conn.on('close', function() {
                delete connections[key];
            });
        });

        // @ts-ignore
        this._server.destroy = cb => {
            this._server.close(cb);

            for (let key in connections) {
                connections[key].destroy();
            }
        };

        if (cluster.isMaster) {

            cluster.on('message', (worker, message) => {
                switch (message) {
                    case 'reload':
                        this._logger.log("Restarting...");
                        worker.send('isKilled');
                        break;
                    case 'kill':
                        worker.kill();
                        cluster.fork();
                        break;
                    case 'stop':
                        worker.kill();
                        process.exit(1);
                    default:
                        return;
                }
            });

            cluster.fork();
        } else {

            // cluster.isWorker x

            // Watch file change and restart
            // @ts-ignore
            if (!options.production) {

                let pathsToWatch = this._plugins.map((p,i) => {
                    return p.getPath()
                }).concat([path.resolve(path.join(__dirname, "../src"))]);

                // TODO make watch and reload concurrent/not blocking
                chokidar.watch(pathsToWatch, {
                    ignoreInitial: true,
                    ignored: [
                        '**/node_modules',
                        '**/node_modules/**',
                    ],
                    followSymlinks: true
                }).on('all', (event, path) => {
                    this._logger.log(event, path);
                    this._server.close();
                    // @ts-ignore
                    process.send('reload');
                });
            }

            process.on('message', message => {
                switch (message) {
                    case 'isKilled':
                        // @ts-ignore
                        this._server.destroy(() => {
                            // @ts-ignore
                            process.send('kill');
                        });
                        break;
                    default:
                    // Do nothing.
                }
            });

            const PORT = this.config.get("port", DEFAULT_PORT);
            this._server.listen(PORT, () => {
                this._logger.log(`Our app is running on port ${ PORT }`);
            });
        }
    }

    /**
     *
     * @param rootDir
     * @returns {Application}
     */
    boot(rootDir: string) {

        this._booted = false;
        this.dir = rootDir;
        this._setupConfig();
        this._setupBaseService();
        this._setupPlugins();

        let themePublicPath = this._setupTheme();
        this._setupBaseMiddlewares(themePublicPath);

        this.emit('boot');
        this._booted = true;
        return this;
    }

    private _setupConfig() {
        this.config.load(this.dir);
        let options: Application.Options = {};
        let configFile = `${this.dir}/${CONFIG_FILE_NAME}`;
        if (fs.existsSync(configFile)) {
            options = require(configFile);
        }
        this.config.registerConfig(options);
    }

    private _setupBaseService() {

        let cmd = new commander.Command();
        cmd
            .version(packageJson.version)
            .option('-d, --debug', 'output extra debugging');

        this.set('cmd', cmd);
    }

    private _setupTheme(): string {
        this._theme =  this.config.get('theme', DEFAULT_THEME);
        const themeRoot = path.join(this.dir, 'themes', this._theme);
        const templateRoot = path.join(themeRoot, 'templates');
        const fileSystemLoader = new nunjucks.FileSystemLoader(templateRoot);
        this._view = new nunjucks.Environment(fileSystemLoader, {autoescape: true});
        return path.join(themeRoot, 'public');
    }

    private _setupPlugins() {
        this._pluginPaths= this.config.get('plugins', []);
        this._pluginPaths = this._pluginPaths.concat(['drafterbit/plugins/core']);
        this._plugins = this._pluginPaths.map(m => {
            let _pluginPath = Plugin.resolve(m, this.dir);
            let PluginClass = require(_pluginPath);
            let pluginInstance = new PluginClass(this);
            pluginInstance.setPath(_pluginPath);

            // register config
            if (pluginInstance.canLoad('config')) {
                this.config.registerConfig(pluginInstance.require('config'));
            }

            pluginInstance.loadCommands();

            return pluginInstance;
        });
    }

    private _setupBaseMiddlewares(themePublicPath: string) {
        this.use(serveStatic(path.join(this.dir, "public"), {
            maxAge: 2 * 60 * 60 * 24 * 1000 // 2 days
        }));

        this.use(mount(`/themes/${this._theme}`, serveStatic(themePublicPath, {
            maxAge: 2 * 60 * 60 * 24 * 1000 // 2 days
        })));

        this.use(cors({
            origin: '*',
            allowMethods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            exposeHeaders: 'Content-Range,X-Content-Range'
        }));

        // Error handling
        this.use(async (ctx: any, next: any) => {
            try {
                await next();
            } catch (err) {
                ctx.status = err.status || 500;
                ctx.body = err.message;
                ctx.app.emit('error', err, ctx);
            }
        });
        this.use(bodyParser());
    }

    /**
     *
     * @param logger
     */
    set logger(logger: Console) {
        this._logger = logger
    }

    /**
     *
     */
    get log() {
        return this._logger
    }

}

export default Application;
