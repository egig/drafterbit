import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import { SheetsRegistry } from 'jss';
import Main from './Main';
import { SESSION_SECRET } from '../../config';
import appRoute from './middlewares/app-route';
import ModuleManager from '../ModuleManager';
import PageModule from '../common/modules/page/PageModule';
import apiRoutes from '../api/routes';

const app = express();

const moduleManager = new ModuleManager(app);
moduleManager.registerModule(new PageModule());

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(session({
    secret: SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 30 },
    resave: true,
    saveUninitialized: true,
}));

app.use(express.static(__dirname+'/../../public'));

moduleManager.initialize();
app.use('/api', apiRoutes);
app.use(appRoute);

app.get('*', function (req, res) {

    delete require.cache[require.resolve('../common/defaultState')];
    let defaultState = require('../common/defaultState');

    const sheets = new SheetsRegistry();

    let html = Main(req.url, sheets, defaultState);
    return res.send(`<!DOCTYPE html>${html}`);
});

export default app;