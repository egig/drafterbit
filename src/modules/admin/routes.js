import express from 'express';
import webpack from 'webpack';

import defaultState from './defaultState';
import webpackConfig from './webpack.config';

let router = express.Router();


function compileWebpack() {
	return new Promise((resolve, reject) => {

		// TODO optimize this for production
		webpack(webpackConfig, (err, stats) => { // Stats Object
			if (err || stats.hasErrors()) {

				if (err) {
					console.error(err.stack || err);
					if (err.details) {
						console.error(err.details);
					}
					return reject(err);
				}

				const info = stats.toJson();

				if (stats.hasErrors()) {
					console.error(info.errors);
					return reject(info.errors);
				}

			} else {

				if (stats.hasWarnings()) {
					console.warn(info.warnings);
				}

				return resolve(stats)
			}

		});

	});
};

router.get('/admin', function (req, res) {

	defaultState.COMMON.language = req.language;
	defaultState.COMMON.languages = req.languages;

	if(req.user) {
		defaultState.USER.currentUser = req.user;
	}

	let drafterbitConfig = {
		apiBaseURL: req.app.get('config').get('API_BASE_URL')
	};

	compileWebpack()
		.then(stats => {

			return res.send(`<!DOCTYPE html>
          <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
              <!--TODO include react-table only when we need it -->
                <link rel="stylesheet" type="text/css" href="/vendor/simple-line-icons/css/simple-line-icons.css" />
                <link rel="stylesheet" type="text/css" href="/main.${stats.hash}.css" />
            </head>
            <body>
                <div id="app" ></div>
                <script>
                window.__PRELOADED_STATE__=${JSON.stringify(defaultState)};
                window.__PRELOADED_LANGUAGE_RESOURCES__=${JSON.stringify([])};
                window.__DRAFTERBIT_CONFIG__=${JSON.stringify(drafterbitConfig)};
                </script>
                <script src="/main.${stats.hash}.js"></script>
            </body>
        </html>`);

		})
		.catch(e => {
			console.error(e);

			res.status(500).send(e.message);

		});
});


export default router;