import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import { SheetsRegistry } from 'jss';
import Main from './Main';
import { SESSION_SECRET } from '../../config';
import authMiddleware from './middlewares/auth';
import drafterbit from 'drafterbit';

const app = express();

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
app.use(authMiddleware);
// app.use(jwt({ secret:SESSION_SECRET}).unless({path: ['/login']}));

app.post('/login', function (req, res) {

	(async function () {

		try {
			let client = drafterbit.createClient({});
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

export default app;