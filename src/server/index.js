import "@babel/polyfill";
const path =  require('path');
const express =  require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const authMiddleware = require('./middlewares/auth');
const i18next = require('i18next');
const expressValidator = require('express-validator');
const i18nextExpressMiddleware = require('i18next-express-middleware');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');


const routes = require('./routes');
import config from '../config';
const configMiddleware = require('./middlewares/config');
const cacheMiddleware = require('./middlewares/cache');
const createSession = require('./createSession');

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
    secret: config.get('SESSION_SECRET'),
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

app.use(configMiddleware(config));
app.use(cacheMiddleware(config));

app.post('/login', function (req, res) {

    (async function () {

        try {

            let user = await createSession(req.app, req.body.email, req.body.password);
            req.session.user = user;
            res.send(user);

        } catch (e) {
            res.status(e.status || 500);
            res.send({
                message: e.message
            });
        }

    })();

});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

mongoose.connect(config.get('MONGODB_URL'));

app.get('/', function (req, res) {

    delete require.cache[require.resolve('./defaultState')];
    let defaultState = require('./defaultState');

    defaultState.COMMON.language = req.language;
    defaultState.COMMON.languages = req.languages;

    if(req.user) {
        defaultState.USER.currentUser = req.user;
    }

    let drafterbitConfig = {
        apiBaseURL: config.get('API_BASE_URL')
    };

    return res.send(`<!DOCTYPE html>
          <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
              <!--TODO include react-table only when we need it -->
                <link rel="stylesheet" type="text/css" href="/vendor/simple-line-icons/css/simple-line-icons.css" />
                <link rel="stylesheet" type="text/css" href="/main.css" />
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

let options = {
    swaggerUrl: '/_swagger_spec.json'
};

app.use(
    '/_swagger',
    swaggerUi.serve
);

app.get(
    '/_swagger',
    swaggerUi.setup(null, options),
    (req,res, next) => {
        next();
    }
);

app.use(routes);

module.exports = app;