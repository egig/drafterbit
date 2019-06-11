const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session  = require('express-session');
const expressValidator = require('express-validator');
const FileStore = require('session-file-store')(session);
const cacheMiddleware = require('./middlewares/cache');
const authMiddleware = require('./middlewares/auth');
const config = require('./config');

// TODO add rotate file logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: []
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = function boot(app) {
    // TODO set morgan format in production
    app.use(morgan('dev'));

    app.set('log', logger);
    app.set('config', config);

    app.set('db', mongoose.createConnection(config.get('MONGODB_URL')));

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

    app.use(authMiddleware(config));
    app.use(cacheMiddleware(config));


    app.get('module').initRoutes();
    return app;
};
