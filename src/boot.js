import express from 'express';
import morgan from 'morgan';
import winston from 'winston';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session  from 'express-session';
import i18next from 'i18next';
import expressValidator from 'express-validator';
import i18nextExpressMiddleware from 'i18next-express-middleware';
const FileStore = require('session-file-store')(session);

import cacheMiddleware from './middlewares/cache';
import config from './config';

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

export default function (app) {
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
