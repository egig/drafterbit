const express = require('express');
const minify = require('html-minifier').minify;

let router = express.Router();

router.get('/', function (req, res) {

    const webpackAssets = require(req.app._root+"/build/assets.json");

    let defaultState = {COMMON: {}};
    defaultState.COMMON.language = req.language;
    defaultState.COMMON.languages = req.languages;

    let drafterbitConfig = {
        projectSlug: getProjectSlug(req),
        debug: +DEBUG,
        apiBaseURL: nconf.get('API_BASE_URL'),
        apiKey: nconf.get('API_KEY'),
        userApiBaseURL: nconf.get('USER_API_BASE_URL'),
        userApiKey: nconf.get('USER_API_KEY')
    };

    return res.send(minify(`<!DOCTYPE html>
          <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
                <link rel="stylesheet" type="text/css" href="${assetPath(req, webpackAssets.main.css)}" />
            </head>
            <body>
                <div id="app" ></div>
                <script>
                    window.__PRELOADED_STATE__=${JSON.stringify(defaultState)};
                    window.__PRELOADED_LANGUAGE_RESOURCES__=${JSON.stringify([])};
                    window.__DRAFTERBIT_CONFIG__=${JSON.stringify(drafterbitConfig)};
                </script>
                <script src="${assetPath(req, webpackAssets.main.js)}"></script>
            </body>
        </html>`, { collapseWhitespace: true, minifyJS: true, minifyCSS: true }));
});

module.exports = router;