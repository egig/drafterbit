const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');

const createConfig = require('./createConfig');
const createLogger = require('./createLogger');
const resolveModule = require('./resolveModule');
const createMongooseConn = require('./createMongooseConn');

let app = {};

/**
 *
 * @returns {http.Server}
 */
app.start = function () {

    if(!this._booted) {
        throw new Error('Please run app.boot before app.start');
    }

    let port = process.env.PORT || this.get('config').get('PORT');
    return this.listen(port, () => this.get('log').info(`Listening on port ${port}!`));
};


app.build = function build() {
    this.emit('build');
};

/**
 * 
 * @param {*} str 
 */
app.setDefaultConn = function setDefaultConn(str) {
    this._mongoDefaultConn = str;
};

/**
 *
 * @param options
 * @return {*}
 */
app.boot = function boot(options) {

    this._booted = false;
    this._mongo_connections = {};
    this._mongoDefaultConn = null; // TODO move this to req.locals
    this._mongoConfig = {};
    this._modules = [];

    // build skeletons
    let config = createConfig(options);
    let logger = createLogger(config.get('DEBUG'));
    this.set('log', logger);

    this._mongoDefaultConn = config.get('MONGODB_NAME')  || '_default';
    this._mongoConfig[this._mongoDefaultConn] = {
        protocol: config.get('MONGODB_PROTOCOL'),
        host: config.get('MONGODB_HOST'),
        port: config.get('MONGODB_PORT'),
        user: config.get('MONGODB_USER'),
        pass: config.get('MONGODB_PASS')
    };

    // init modules
    let modules = config.get('modules');
    this._modules = modules.map(m => {
        let modulePath = resolveModule(m, config.get('ROOT_DIR'));
        let ModulesClass = require(modulePath.resolvedPath);
        let moduleInstance = new ModulesClass(this);
        moduleInstance._modulePath = modulePath.resolvedPath;

        // register db schema
        let db = this.getDB();
        if(typeof moduleInstance.registerSchema == 'function') {
            moduleInstance.registerSchema(db);            
        }

        // register config
        if(typeof moduleInstance.config == 'function') {
            config.registerConfig(moduleInstance.config())
        }

        return moduleInstance;
    });

    this.set('config', config);

    // build http schema
    this.use(cors({
        'origin': '*',
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'exposedHeaders': 'Content-Range,X-Content-Range'
    }));

    this.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.use(bodyParser.json({limit: '50mb'}));
    this.use(cookieParser());

    this.use(expressValidator({
        errorFormatter: (param, msg) => {
            return msg;
        }
    }));

    this.emit('boot');

    this.emit('routing');

    this._booted = true;
    return app;
};

/**
 *
 * @param name
 */
app.model = function model(name) {
    return this.getDB().model(name);
};


/**
 *
 * @param dbName
 * @return {*}
 */
app.getDB = function getDB(dbName) {

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

app.initContentTypes = function initContentTypes() {
    let m = this.model("ContentType");
    return m.createContentType("User", "users", "", [
        {
            type_id: 1,
            name: 'name',
            label: "Name",
            validation_rules: "required"
        },
        {
            type_id: 1,
            name: 'email',
            label: "Email",
            validation_rules: "required"
        },
        {
            type_id: 1,
            name: 'password',
            label: "Password",
            validation_rules: "required"
        },
    ]).then(r => {
        console.log("Create content type users success")
    });
};

module.exports = app;