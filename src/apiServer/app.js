const path =  require('path');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const expressValidator = require('express-validator');
const cors = require('cors');

const config = require('../config');
const routes = require('./routes');
const Cache = require('./lib/cache/Cache');
const RedisDriver = require('./lib/cache/RedisDriver');

const app = express();
app.use(cors());

app.use(bodyParser());
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

app.use(express.static(__dirname+'/../public'));

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

module.exports = app;