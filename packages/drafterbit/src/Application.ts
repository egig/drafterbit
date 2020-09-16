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
    }
}

class Application extends Koa {

    private _booted: boolean = false;
    private _plugins: Plugin[] = [];
    projectDir = "";
    private _services: any = {};
    private _pluginPaths: string[] = [];
    private _view: nunjucks.Environment | undefined;
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
     * @returns {Promise<[unknown]>}
     */
    install() {

        let installs = this._plugins.map(m => {
            return m.install(this)
        });

        return Promise.all(installs)
            .then(() => {
                this.get('log').info("Installation Complete.");
                process.exit(0)
            })
            .catch(e => {
                this.get('log').error("Installation Failed.", e);
                process.exit(1)
            })
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

        let viewsPath = path.join(this.projectDir, 'views');
        this._view = new nunjucks.Environment(new nunjucks.FileSystemLoader(viewsPath),  {autoescape: true});

        // build skeletons
        let options: Application.Options = {};
        let configFileName = 'drafterbit.config.js';
        let configFile = `${rootDir}/${configFileName}`;
        if (fs.existsSync(configFile)) {
            options = require(configFile);
        }

        this._pluginPaths= options.plugins || [];

        let config = new Config(rootDir, options);
        this.set('config', config);

        let logger = this.createLogger();
        this.set('log', logger);

        let cmd = commander;
        cmd
            .version('0.0.1')
            .option('-d, --debug', 'output extra debugging');

        this.set('cmd', cmd);

        // init plugins
        this._plugins = this._pluginPaths.map(m => {
            let _pluginPath = Plugin.resolve(m, this.projectDir);
            let ModulesClass = require(_pluginPath);
            let moduleInstance = new ModulesClass(this);
            moduleInstance.setPath(_pluginPath);

            // register config
            if (moduleInstance.canLoad('config')) {
                config.registerConfig(moduleInstance.require('config'));
            }

            moduleInstance.loadCommands();

            return moduleInstance;
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
