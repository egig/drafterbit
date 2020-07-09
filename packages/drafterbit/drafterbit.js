const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const c2k = require('koa-connect');

const bodyParser = require('koa-bodyparser');
const cors = require('cors');
const Config = require('./Config');
const createLogger = require('./createLogger');
const Module = require('./Module');
const createMongooseConn = require('./createMongooseConn');
const commander = require('commander');

class Drafterbit extends Koa {

    constructor(options) {
        super(options);

        this._booted = false;
        this._mongo_connections = {};
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
        this._mongo_connections = {};
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
        let logger = createLogger(config.get('DEBUG'));
        this.set('log', logger);
        this.set('config', config);

        this._mongoDefaultConn = config.get('MONGODB_NAME')  || '_default';
        this._mongoConfig[this._mongoDefaultConn] = {
            protocol: config.get('MONGODB_PROTOCOL'),
            host: config.get('MONGODB_HOST'),
            port: config.get('MONGODB_PORT'),
            user: config.get('MONGODB_USER'),
            pass: config.get('MONGODB_PASS')
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
            protocol,
            host,
            port,
            user,
            pass
        } = this._mongoConfig[dbName];

        if(!this._mongo_connections[dbName]) {
            this._mongo_connections[dbName] = createMongooseConn(this, protocol, dbName, host, user, pass, port);
        }

        return this._mongo_connections[dbName];
    };


}

module.exports = Drafterbit;