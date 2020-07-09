const Koa = require('koa');
const c2k = require('koa-connect');

const bodyParser = require('koa-bodyparser');
const cors = require('cors');
const createConfig = require('./createConfig');
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

    setDefaultConn(str) {
        this._mongoDefaultConn = str;
    };

    boot(options) {

        this._booted = false;
        this._mongo_connections = {};
        this._mongoDefaultConn = null; // TODO move this to req.locals
        this._mongoConfig = {};
        this._modules = [];

        // build skeletons
        let config = createConfig(options);
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

        // cmd
        //     .version('0.0.1')
        //     .option('-d, --debug', 'output extra debugging');

        // init modules
        this._modules = this.modules.map(m => {
            let modulePath = Module.resolve(m, config.get('ROOT_DIR'));
            let ModulesClass = require(modulePath);
            let moduleInstance = new ModulesClass(this);
            moduleInstance._modulePath = modulePath;

            // register db schema
            let db = this.getDB();
            if(typeof moduleInstance.registerSchema == 'function') {
                moduleInstance.registerSchema(db);
            }

            // register config
            if(typeof moduleInstance.config == 'function') {
                config.registerConfig(moduleInstance.config());
            }

            // register cmd
            if(typeof moduleInstance.commands == 'function') {
                let commands = moduleInstance.commands(this);
                commands.map(command => {
                    cmd.command(command.command)
                        .description(command.description)
                        .action(command.action);
                });
            }
            return moduleInstance;
        });

        this.set('cmd', cmd);

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