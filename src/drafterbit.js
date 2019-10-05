const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createConfig = require('./createConfig');
const createLogger = require('./createLogger');
const cors = require('cors');
const expressValidator = require('express-validator');
const { ERRNOROOTDIR } = require('./constants');

// TODO
// const session  = require('express-session');
// const FileStore = require('session-file-store')(session);

const { getFieldTypes } = require('./fieldTypes');
const resolveModule = require('./resolveModule');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);

let app = express();

app._models = [];
app._booted = false;
app._mongo_connections = {};
app._mongoDefaultConn = null;
app._mongoConfig = {};
app.modules = [];

/**
 *
 */
app.start = function () {

    if(!this._booted) {
        throw new Error('Please run app.boot before app.start');
    }

    let port = this.get('config').get('PORT');
    return this.listen(port, () => this.get('log').info(`Listening on port ${port}!`));
};


app.build = function build() {
    // init modules
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

    // this is config file
    if (typeof options == 'string') {
        this._root = path.dirname(options);
    } else {

        if(!options['ROOT_DIR']) {
            throw new Error(ERRNOROOTDIR);
        }

        this._root = options['ROOT_DIR'];
    }

    // build skeletons
    let config = createConfig(options);
    let logger = createLogger(config.get('debug'));
    this.set('log', logger);

    this. _mongoDefaultConn = config.get('MONGODB_NAME')  || '_default';
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
        let modulePath = resolveModule(m, this._root);
        let ModulesClass = require(modulePath.resolvedPath);
        let moduleInstance = new ModulesClass(this);
        moduleInstance._modulePath = modulePath.resolvedPath;

        // register db schema
        let db = this.getDB();
        if(typeof moduleInstance.registerSchema == 'function') {
            moduleInstance.registerSchema(db);            
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

    // TODO
    // this.use(session({
    //     store: new FileStore({path: this._root+'/tmp'}),
    //     secret: this.get('config').get('SESSION_SECRET'),
    //     cookie: { maxAge: 24 * 60 * 60 * 30 },
    //     resave: true,
    //     saveUninitialized: true,
    // }));

    this.use(expressValidator({
        errorFormatter: (param, msg) => {
            return msg;
        }
    }));

    // this.use(modelMiddleware());
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

    if(!this._mongo_connections[dbName]) {

        const {
            protocol,
            host,
            port,
            user,
            pass
        } = this._mongoConfig[dbName];

        if(user || pass) {
            host = `@${host}`;
        }

        let uri = `${protocol}://${user}${pass ? `:${pass}` : ''}${host}${port ? `:${port}` : ''}/${dbName}?retryWrites=true&w=majority`;

        this.get('log').info('DB URI = ' + uri);
        let conn = mongoose.createConnection(uri, {
            connectTimeoutMS: 9000,
        }, err => {
            if(err) {
                app.get('log').error('Error create connection for', dbName);
                app.get('log').error(err);
            }
        });

        conn.on('error', err => {
            if(err) {
                app.get('log').error(err);
            }
        });

        this._mongo_connections[dbName] = conn;
    }

    return this._mongo_connections[dbName];
};

app._getFieldTypes = getFieldTypes;

module.exports = app;