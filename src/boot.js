const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session  = require('express-session');
const i18next = require('i18next');
const expressValidator = require('express-validator');
const i18nextExpressMiddleware = require('i18next-express-middleware');
const FileStore = require('session-file-store')(session);
const cacheMiddleware = require('./middlewares/cache');
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

    i18next
        .use(i18nextExpressMiddleware.LanguageDetector)
        .init({
            preload: ['en', 'id'],
        });

    app.use(i18nextExpressMiddleware.handle(i18next, {
        removeLngFromUrl: false
    }));
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
}
