import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import { SheetsRegistry } from 'jss';
import Main from './Main';
import authMiddleware from './middlewares/auth';
import i18next from 'i18next';
import apiClient from '../apiClient';
const path =  require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const expressValidator = require('express-validator');
const cors = require('cors');

const config = require('../config');
const routes = require('../apiServer/routes');
const Cache = require('../apiServer/lib/cache/Cache');
const RedisDriver = require('../apiServer/lib/cache/RedisDriver');

// TODO we can not use import for i18next-express-middleware
const i18nextExpressMiddleware = require('i18next-express-middleware');

i18next
	.use(i18nextExpressMiddleware.LanguageDetector)
	.init({
		preload: ['en', 'id'],
	});

const app = express();
app.use(cors());

app.use(i18nextExpressMiddleware.handle(i18next, {
	removeLngFromUrl: false
}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(session({
    secret: config.get("SESSION_SECRET"),
    cookie: { maxAge: 24 * 60 * 60 * 30 },
    resave: true,
    saveUninitialized: true,
}));

app.use(express.static(__dirname+'/../../public'));
app.use(authMiddleware);
app.use(expressValidator({
	errorFormatter: (param, msg, value, location) => {
		return msg;
	}
}));

app.set('config', config);
const redisDriver = new RedisDriver({
	host: config.get("REDIS_HOST"),
	port: config.get("REDIS_PORT"),
	db: config.get("REDIS_DB"),
	prefix: "dt"
});
const cache = new Cache(redisDriver);
app.set('cache', cache);
app.use('/v1', routes);

app.post('/login', function (req, res) {

	(async function () {

		try {
			let client = apiClient.createClient({
				baseURL: config.get("API_BASE_URL")
			});
			let user = await client.createUserSession(req.body.email, req.body.password);
			req.session.user = user;
			res.send(user);

		} catch (e) {
			res.status(e.status || 500);
			res.send({
				message: e.message
			})
		}

	})();

});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login');
});

app.get('*', function (req, res) {

    delete require.cache[require.resolve('../common/defaultState')];
    let defaultState = require('../common/defaultState');

    defaultState.common.language = req.language;
    defaultState.common.languages = req.languages;

    const sheets = new SheetsRegistry();

    if(req.user) {
    	defaultState.user.currentUser = req.user;
    }

    let main = Main(req.url, sheets, defaultState);
    let html = main.html;

    if(main.context.location) {
    	return res.redirect(main.context.url);
    }

    return res.send(`<!DOCTYPE html>${html}`);
});


const docTitle = config.get('DOCS_TITLE');
const showExplorer = false;
const options = {};
const customCss = '';
const customFavicon = '';
const swaggerUrl = '';


const swaggerSpec = swaggerJSDoc({
	swaggerDefinition: {
		info: {
			title: "Drafterbit",
			version: "v1.0",
		},
		basePath: "/v1"
	},
	apis: [
		'./src/routes/*',
	],
});

app.use(
	'/v1/swagger-ui',
	swaggerUi.serve,
	swaggerUi.setup(
		swaggerSpec,
		showExplorer,
		options,
		customCss,
		customFavicon,
		swaggerUrl,
		docTitle,
		(req, res, next) => {
			next();
		}
	)
);

app.get('/v1/api-docs.json', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

export default app;