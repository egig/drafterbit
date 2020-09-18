import fs from 'fs';
import path from 'path';
import Koa from 'koa';

import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Config from './Config';
import Plugin from './Plugin';
import commander from 'commander';
import winston from 'winston';
import chokidar from 'chokidar';
import cluster from 'cluster';
import http from 'http'
import execa from 'execa'
import nunjucks from 'nunjucks';

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


    type Options = {
        plugins?: string[]
        theme?: string
        app_name?: string
        base_url?: string
    }
}

class Application extends Koa {

    private _booted: boolean = false;
    private _plugins: Plugin[] = [];
    projectDir = "";
    options: Application.Options = {};
    private _services: any = {};
    private _pluginPaths: string[] = [];
    private _view: nunjucks.Environment | undefined;
    private _theme: string  = "penabulu";
    private _server = http.createServer(this.callback());

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
    getTheme() {
        return this._theme;
    }

    /**
     *
     */
    build(options: {
        production?: boolean
    } = {}): void {
        this.emit('build', options);
    }

    /**
     *
     * @returns {Array}
     */
    plugins() {
        return this._plugins
    }

    /**
     *
     */
    routing() {
        this._plugins.map(m => {
            m.loadRoutes();
        });
    }

    start(options: {
        production?: boolean
    } = {}) {

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

        this.routing();
        this.emit('pre-start');

        if (cluster.isMaster) {

            cluster.on('message', (worker, message) => {
                switch (message) {
                    case 'reload':
                        console.log("Restarting...");
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
                // TODO include users plugins
                let pathsToWatch = [path.resolve(path.join(__dirname, "../src"))];
                console.log("pathsToWatch", pathsToWatch);

                // TODO make watch and reload concurrent/not blocking
                chokidar.watch(pathsToWatch, {
                    ignoreInitial: true,
                    ignored: [
                        '**/node_modules',
                        '**/node_modules/**',
                    ],
                    followSymlinks: true
                }).on('all', (event, path) => {
                    console.log(event, path);
                    this._server.close();

                    console.log("rebuilding...");
                    execa.commandSync("npm run build",{
                        stdio: "inherit",
                        cwd: this.projectDir
                    });

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

            const PORT = process.env.PORT || this.get('config').get("PORT") || 3000;
            this._server.listen(PORT, () => {
                console.log(`Our app is running on port ${ PORT }`);
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
        this.projectDir = rootDir;

        let options: Application.Options = {};
        let configFileName = 'drafterbit.config.js';
        let configFile = `${rootDir}/${configFileName}`;
        if (fs.existsSync(configFile)) {
            options = require(configFile);
        }

        this.options = options;

        if (options.theme) {
            this._theme =  options.theme
        }
        const themeRoot = path.join(this.projectDir, 'themes', this._theme);
        const templateRoot = path.join(themeRoot, 'templates');
        const staticDir = path.join(themeRoot, 'public');
        const fileSystemLoader = new nunjucks.FileSystemLoader(templateRoot);
        this._view = new nunjucks.Environment(fileSystemLoader, {autoescape: true});

        this.use(require('koa-static')(staticDir, {
            maxAge: 2 * 60 * 60 * 24 * 1000 // 2 days
        }));

        this._pluginPaths= options.plugins || [];
        this._pluginPaths = this._pluginPaths.concat(['drafterbit/plugins/core']);

        let config = new Config(rootDir, options);
        this.set('config', config);

        let logger = this.createLogger();
        this.set('log', logger);

        let cmd = commander;
        cmd
            .version(packageJson.version)
            .option('-d, --debug', 'output extra debugging');

        this.set('cmd', cmd);

        // init plugins
        this._plugins = this._pluginPaths.map(m => {
            let _pluginPath = Plugin.resolve(m, this.projectDir);
            let PluginClass = require(_pluginPath);
            let pluginInstance = new PluginClass(this);
            pluginInstance.setPath(_pluginPath);

            // register config
            if (pluginInstance.canLoad('config')) {
                config.registerConfig(pluginInstance.require('config'));
            }

            pluginInstance.loadCommands();

            return pluginInstance;
        });

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

        this.use(cors({
            origin: '*',
            allowMethods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            exposeHeaders: 'Content-Range,X-Content-Range'
        }));

        this.use(bodyParser());

        this.emit('boot');

        this._booted = true;
        return this;
    }

    /**
     *
     */
    createLogger() {

        // TODO add rotate file logger
        const logger = winston.createLogger({
            level: this.get('config').get('DEBUG') ? 'debug' : 'warn',
            format: winston.format.json(),
            transports: []
        });

        if (process.env.NODE_ENV !== 'production') {
            logger.add(new winston.transports.Console({
                format: winston.format.simple()
            }));
        }

        return logger;
    }

}

export default Application;
