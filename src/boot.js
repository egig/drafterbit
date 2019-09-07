const path = require('path');
const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session  = require('express-session');
const expressValidator = require('express-validator');
const cors = require('cors');
// const basicAuth = require('express-basic-auth');
const FileStore = require('session-file-store')(session);
const cacheMiddleware = require('./middlewares/cache');
const getConfig = require('./getConfig');

// TODO add rotate file logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: []
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = function boot(app, configFile) {

    app._root = path.dirname(configFile);
    logger.info("Boot application with config: " + configFile);

    app.use(cors({
        'origin': '*',
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'exposedHeaders': 'Content-Range,X-Content-Range'
    }));

    // TODO set morgan format in production
    app.use(morgan('dev'));

    app.set('log', logger);
    let config = getConfig(configFile);
    app.set('config', config);

    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(cookieParser());
    app.use(session({
        store: new FileStore({path: './tmp'}),
        secret: config.get('SESSION_SECRET'),
        cookie: { maxAge: 24 * 60 * 60 * 30 },
        resave: true,
        saveUninitialized: true,
    }));

    app.use(express.static(__dirname+'/../public'));

    app.get('module').init();
    app.emit('boot');

    app.use(expressValidator({
        errorFormatter: (param, msg) => {
            return msg;
        }
    }));
    
    app.use(cacheMiddleware(config));

    app.get('module').initRoutes();
    return app;
};
