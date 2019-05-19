import express from 'express';
import cacheMiddleware from './middlewares/cache';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session  from 'express-session';
import i18next from 'i18next';
import expressValidator from 'express-validator';
import i18nextExpressMiddleware from 'i18next-express-middleware';
import mongoose from 'mongoose';

import routes from './routes';
import config from './config'

import bootSwagger from  './modules/swagger/boot'

export default function (app) {

	app.get('module').init();

	bootSwagger(app);

	app.set('config', config);
	app.emit("boot");

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
		secret: config.get('SESSION_SECRET'),
		cookie: { maxAge: 24 * 60 * 60 * 30 },
		resave: true,
		saveUninitialized: true,
	}));

	app.use(express.static(__dirname+'/../public'));
	app.use(expressValidator({
		errorFormatter: (param, msg, value, location) => {
			return msg;
		}
	}));

	app.use(cacheMiddleware(config));


	app.use(routes);

	return app;
}
