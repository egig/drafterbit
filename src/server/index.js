const express =  require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const authMiddleware = require('./middlewares/auth');
const i18next = require('i18next');
const apiClient = require('../apiClient');
const path =  require('path');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJSDoc = require('swagger-jsdoc');
const expressValidator = require('express-validator');
// const cors = require('cors');

const config = require('../config');

// TODO we can not use import for i18next-express-middleware
const i18nextExpressMiddleware = require('i18next-express-middleware');

i18next
	.use(i18nextExpressMiddleware.LanguageDetector)
	.init({
		preload: ['en', 'id'],
	});

const app = express();
// app.use(cors());

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

    if(req.user) {
    	defaultState.user.currentUser = req.user;
    }

    let drafterbitConfig = {
	    apiBaseURL: config.get('API_BASE_URL')
    };

    return res.send(`<!DOCTYPE html>
          <html>
            <head>
		            <meta charSet="utf-8" />
		            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
		            <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.css" />
	              <!--TODO include react-table only when we need it -->
                <link rel="stylesheet" type="text/css" href="/vendor/react-bootstrap-table-next/react-bootstrap-table2.css"  />
                <link rel="stylesheet" type="text/css" href="/vendor/simple-line-icons/css/simple-line-icons.css" />
                <link rel="stylesheet" type="text/css" href="/css/common.css" />
            </head>
            <body>
                <div id="app" ></div>
                <script>
                window.__PRELOADED_STATE__=${JSON.stringify(defaultState)};
                window.__PRELOADED_LANGUAGE_RESOURCES__=${JSON.stringify([])};
                window.__DRAFTERBIT_CONFIG__=${JSON.stringify(drafterbitConfig)};
                </script>
                <script src="/bundle.js"></script>
            </body>
        </html>`);
});
//
//
// const docTitle = config.get('DOCS_TITLE');
// const showExplorer = false;
// const options = {};
// const customCss = '';
// const customFavicon = '';
// const swaggerUrl = '';
//
//
// const swaggerSpec = swaggerJSDoc({
// 	swaggerDefinition: {
// 		info: {
// 			title: "Drafterbit",
// 			version: "v1.0",
// 		},
// 		basePath: "/v1"
// 	},
// 	apis: [
// 		'./src/routes/*',
// 	],
// });
//
// app.use(
// 	'/v1/swagger-ui',
// 	swaggerUi.serve,
// 	swaggerUi.setup(
// 		swaggerSpec,
// 		showExplorer,
// 		options,
// 		customCss,
// 		customFavicon,
// 		swaggerUrl,
// 		docTitle,
// 		(req, res, next) => {
// 			next();
// 		}
// 	)
// );
//
// app.get('/v1/api-docs.json', function(req, res) {
// 	res.setHeader('Content-Type', 'application/json');
// 	res.send(swaggerSpec);
// });

module.exports = app;