const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createConfig = require('./createConfig');
const createLogger = require('./createLogger');
const cors = require('cors');
const session  = require('express-session');
const expressValidator = require('express-validator');
const FileStore = require('session-file-store')(session);
const cacheMiddleware = require('./middlewares/cache');
const { getFieldTypes } = require('./fieldTypes');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);

let app = express();

app._models = [];
app._booted = false;
app._mongo_connections = {};
app.modules = [];

/**
 *
 */
app.start = function () {

    if(!this._booted) {
        throw new Error("Please run app.boot before app.start");
    }

    let port = this.get('config').get("PORT");
    this.listen(port, () => console.log(`Listening on port ${port}!`))
};


app.build = function build() {
    // init modules
    this.emit('build')
};

/**
 *
 * @param configFile
 * @return {*}
 */
app.boot = function boot(configFile) {

    // build skeletons
    this._root = path.dirname(configFile);
    let config = createConfig(configFile);
    let logger = createLogger(config.get("DEBUG"));


    // init modules
    let modules = config.get("modules");
    modules.map(m => {
        m(app);
    });

    this.set('config', config);

    this.set('log', logger);

    // build http schema
    this.use(cors({
        'origin': '*',
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'exposedHeaders': 'Content-Range,X-Content-Range'
    }));

    this.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.use(bodyParser.json({limit: '50mb'}));
    this.use(cookieParser());
    this.use(session({
        store: new FileStore({path: this._root+'/tmp'}),
        secret: this.get('config').get('SESSION_SECRET'),
        cookie: { maxAge: 24 * 60 * 60 * 30 },
        resave: true,
        saveUninitialized: true,
    }));

    this.use(expressValidator({
        errorFormatter: (param, msg) => {
            return msg;
        }
    }));

    this.use(cacheMiddleware(config));

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
    return this.getDB(this._project).model(name)
}


/**
 *
 * @param dbName
 * @return {*}
 */
app.getDB = function getDB(dbName) {

    if(!this._mongo_connections[dbName]) {
        let config = app.get('config');
        let p = config.get('MONGODB_PROTOCOL');
        let host = config.get('MONGODB_HOST');
        let port = config.get('MONGODB_PORT');
        let user = config.get('MONGODB_USER');
        let pass = config.get('MONGODB_PASS');

        if(user || pass) {
            host = `@${host}`
        }

        let uri = `${p}://${user}${pass ? `:${pass}` : ''}${host}${port ? `:${port}` : ''}/${dbName}?retryWrites=true&w=majority`;

        this.get('log').info("DB URI = " + uri);
        let conn = mongoose.createConnection(uri, {
            connectTimeoutMS: 9000,
        }, err => {
            if(err) {
                app.get('log').error("Error create connection for", dbName);
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

/**
 *
 */
app._initRoutes = function _initRoutes() {
    Object.keys(this.modules).forEach(name => {
        let routes = this._modules[name].getRoutes();
        this.use(routes);
    });
}

/**
 *
 */
app._getFieldTypes = getFieldTypes;

module.exports = app;