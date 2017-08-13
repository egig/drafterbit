const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const _ = require('lodash');
const { SheetsRegistry } = require('jss');
const Main = require('./Main');
import api from './routes/api';

// HMR
if(!_.includes(['production', 'alpha', 'staging', 'test'], process.env.NODE_ENV )) {
	let webpack = require('webpack');
	let webpackDevMiddleware = require('webpack-dev-middleware')
	let webpackHotMiddleware = require('webpack-hot-middleware')
	let wpconfig = require('../../webpack.config');
	let compiler = webpack(wpconfig);
	app.use(webpackDevMiddleware(compiler, { noInfo: true }))
	app.use(webpackHotMiddleware(compiler));
}

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(session({
	secret: 'etgr-session-secret', // TODO move this to config
	cookie: { maxAge: 24 * 60 * 60 * 30 },
	resave: true,
	saveUninitialized: true,
}));

app.use(express.static(__dirname+'/../../public'));

// Auth Middleware
app.use(function (req, res, next) {
	if(typeof req.session.user !== 'undefined') {
		req.user = req.session.user;
	} else {
		req.user = false;
	}

	next();
});


app.use('/api', api);

app.get('/logout', function (req, res) {

	req.session.destroy(function () {
		res.redirect('/user/login');
	});

});

app.get('*', function (req, res) {

	delete require.cache[require.resolve('../common/defaultState')];
	let defaultState = require('../common/defaultState');

	if(req.user) {
		defaultState.user.loggedIn = 1;
		defaultState.user.currentUser = req.user;
	}

	const sheets = new SheetsRegistry();

	let html = Main(req.url, sheets, defaultState);
	return res.send(`<!DOCTYPE html>${html}`);
});

module.exports = app;