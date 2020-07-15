const fs = require('fs');
const Koa = require('koa');
const c2k = require('koa-connect');

const bodyParser = require('koa-bodyparser');
const cors = require('cors');
const Config = require('./Config');
const Module = require('./Module');
const commander = require('commander');
const winston = require('winston');
const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);
mongoose.set('useUnifiedTopology', true);

class Application extends Koa {

    constructor(options) {
        super(options);

        this._booted = false;
        this._mongoConnections = {};
        this._mongoDefaultConn = null; // TODO move this to req.locals
        this._mongoConfig = {};
        this._modules = [];
        this.modules = [];
        this.services = [];
        this.projectDir = "";
    }

    set(key, value){
        this.services[key] = value;
    }

    get(key){
        return this.services[key];
    }

    build() {
        this.emit('build');
    }

    routing() {
        this._modules.map(m => {
            m.loadRoutes();
        })
    };

    boot(rootDir) {

        this._booted = false;
        this._mongoConnections = {};
        this._mongoDefaultConn = null; // TODO move this to req.locals
        this._mongoConfig = {};
        this._modules = [];
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
        let logger = this.createLogger(config.get('DEBUG'));
        this.set('log', logger);
        this.set('config', config);

        this._mongoDefaultConn = config.get('MONGODB_NAME')  || '_default';
        this._mongoConfig[this._mongoDefaultConn] = {
            uri: config.get('MONGODB_URI'),
        };

        let cmd = commander;
        cmd
            .version('0.0.1')
            .option('-d, --debug', 'output extra debugging');

        this.set('cmd', cmd);

        // init modules
        this._modules = this.modules.map(m => {
            let modulePath = Module.resolve(m, this.projectDir);
            let ModulesClass = require(modulePath);
            let moduleInstance = new ModulesClass(this);
            moduleInstance._modulePath = modulePath;

            // register db schema
            let db = this.getDB();
            if(typeof moduleInstance.registerSchema == 'function') {
                moduleInstance.registerSchema(db);
            }

            // register config
            if (moduleInstance.canLoad('config')) {
                config.registerConfig(moduleInstance.require('config'))
            }

            moduleInstance.loadCommands();

            return moduleInstance;
        });

        // this.use(serve('./build'));

        this.use(async (ctx, next) => {
            try {
                await next();
            } catch (err) {
                ctx.status = err.status || 500;
                ctx.body = err.message;
                ctx.app.emit('error', err, ctx);
            }
        });

        // build http schema
        this.use(c2k(cors({
            'origin': '*',
            'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'exposedHeaders': 'Content-Range,X-Content-Range'
        })));

        this.use(bodyParser());

        this.emit('boot');

        this._booted = true;
        return this;
    };

    model(name) {
        return this.getDB().model(name);
    };

    getDB(dbName) {

        dbName = dbName || this._mongoDefaultConn;
        let {
            uri
        } = this._mongoConfig[dbName];

        if(!this._mongoConnections[dbName]) {
            this._mongoConnections[dbName] = this.createMongooseConn(uri);
        }

        return this._mongoConnections[dbName];
    };

    createMongooseConn(uri) {

        let conn = mongoose.createConnection(uri, {
            connectTimeoutMS: 9000,
        }, err => {
            if(err) {
                this.get('log').error(err);
            }
        });

        conn.on('error', err => {
            if(err) {
                this.get('log').error(err);
            }
        });

        return conn;
    };

    createLogger(debug) {

        // TODO add rotate file logger
        const logger = winston.createLogger({
            level: debug ? 'debug' : 'warn',
            format: winston.format.json(),
            transports: []
        });

        if (process.env.NODE_ENV !== 'production') {
            logger.add(new winston.transports.Console({
                format: winston.format.simple()
            }));
        }

        return logger;
    };

}

module.exports = Application;