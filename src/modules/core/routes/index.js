const express = require('express');
const minify = require('html-minifier').minify;

let router = express.Router();

/**
 *
 * @param {*} req
 * @param {*} asset
 */
function assetPath(req, asset) {
    // TODO support cdn
    return asset;
}

router.get('/', function (req, res) {

    const webpackAssets = require(req.app.get('config').get('ROOT_DIR')+'/build/assets.json');

    let defaultState = {COMMON: {}};
    defaultState.COMMON.language = req.language;
    defaultState.COMMON.languages = req.languages;

    let config = req.app.get('config');

    let drafterbitConfig = {
        appName: config.get('APP_NAME'),
        debug: +config.get('DEBUG')
    };

    req.app._modules.map(mo => {
        if (typeof mo.registerClientConfig == 'function') {
            drafterbitConfig = Object.assign({}, drafterbitConfig, mo.registerClientConfig(config));
        }
    });

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