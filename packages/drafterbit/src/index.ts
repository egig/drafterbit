import fs from 'fs';
import Koa from 'koa';

import bodyParser from 'koa-bodyparser';
const cors = require('@koa/cors');
import Config from './Config';
import Plugin from './Plugin';
const commander = require('commander');
const winston = require('winston');
const mongoose = require('mongoose');
import { getListPlugin } from "./odm";

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);
mongoose.set('useUnifiedTopology', true);
mongoose.plugin(getListPlugin);

declare namespace Application {
    interface Request extends Koa.Request {
        body: any
    }

    interface Context extends Koa.Context {
        app: Application,
        request: Request
    }

    type Next = Koa.Next
}

type Options = {
    plugins: string[]
}

class Application extends Koa {

    private _booted: boolean = false;
    private _plugins: Plugin[] = [];
    private _odmConnections: any = {};
    private _odmDefaultConn: string = '_default';
    private _odmConfig: any = {};
    projectDir = "";
    private _services: any = {};
    private _pluginPaths: string[] = [];

    /**
     *
     * @param options
     */
    constructor(options: Options = { plugins: [] }) {
        super();
        this._pluginPaths= options.plugins || [];
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
     */
    build(): void {
        this.emit('build');
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

        // TODO use mongoose transaction
        let installs = this._plugins.map(m => {
            return m.install(this)
        });

        return Promise.all(installs)
            .then(() => {
                this.get('log').info("Installation Complete.");
                process.exit(0)
            })
            .catch(e => {
                this.get('log').error("Installation Failed.");
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

    /**
     *
     * @param rootDir
     * @returns {Application}
     */
    boot(rootDir: string) {

        this._booted = false;
        this.projectDir = rootDir;

        // build skeletons
        let options;
        let configFileName = 'config.js';
        let configFile = `${rootDir}/${configFileName}`;
        if (fs.existsSync(configFile)) {
            options = require(configFile);
        } else {
            options = {};
        }

        let config = new Config(rootDir, options);
        this.set('config', config);

        let logger = this.createLogger();
        this.set('log', logger);

        this._odmConfig[this._odmDefaultConn] = {
            uri: config.get('MONGODB_URI'),
        };

        let cmd = commander;
        cmd
            .version('0.0.1')
            .option('-d, --debug', 'output extra debugging');

        this.set('cmd', cmd);

        // init plugins
        this._plugins = this._pluginPaths.map(m => {
            let modulePath = Plugin.resolve(m, this.projectDir);
            let ModulesClass = require(modulePath);
            let moduleInstance = new ModulesClass(this);
            moduleInstance.setPath(modulePath);

            let db = this.odm();
            moduleInstance.registerSchema(db);

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
            'origin': '*',
            'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'exposedHeaders': 'Content-Range,X-Content-Range'
        }));

        this.use(bodyParser());

        this.emit('boot');

        this._booted = true;
        return this;
    }

    /**
     *
     * @param name
     */
    model(name: string) {
        return this.odm().model(name);
    }

    /**
     *
     * @param name
     * @returns {*}
     */
    odm(name?: string) {

        name = name || this._odmDefaultConn;

        let config = this._odmConfig[name];
        if (typeof config === 'undefined') {
            throw new Error('Unknown connection name '+name )
        }

        if(!this._odmConnections[name]) {
            this._odmConnections[name] = this.createODMConn(config.uri);
        }

        return this._odmConnections[name];
    }

    /**
     *
     * @param uri
     * @returns {*}
     */
    createODMConn(uri: string) {

        let conn = mongoose.createConnection(uri);

        conn.on('error', (err: any) => {
            if(err) {
                this.get('log').error(err);
            }
        });

        return conn;
    }

    /**
     *
     * @param debug
     * @returns {winston.Logger}
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

export = Application;