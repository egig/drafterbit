const express = require('express');
const minify = require('html-minifier').minify;

let router = express.Router();

function getProjectSlug(req) {
    let projectSlug = req.subdomains.pop();
    return projectSlug || '_default';
}

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

    const webpackAssets = require(req.app._root+'/build/assets.json');

    let defaultState = {COMMON: {}};
    defaultState.COMMON.language = req.language;
    defaultState.COMMON.languages = req.languages;

    let config = req.app.get('config');

    let drafterbitConfig = {
        appName: config.get('appName'),
        projectSlug: getProjectSlug(req),
        debug: +config.get('DEBUG')
    };

     req.app._modules.map(mo => {
        if (typeof mo.registerClientConfig == 'function') {
            drafterbitConfig = Object.assign({}, drafterbitConfig, mo.registerClientConfig(config))
        }
    });

    let ft = req.app._getFieldTypes();
    let constants = {};
    ft.map(f => {
        constants[f.code] = f.id;
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
                    window.__DT_FIELD_TYPES=${JSON.stringify(req.app._getFieldTypes())};
                    window.__DT_CONST=${JSON.stringify(constants)};
                </script>
                <script src="${assetPath(req, webpackAssets.main.js)}"></script>
            </body>
        </html>`, { collapseWhitespace: true, minifyJS: true, minifyCSS: true }));
});

module.exports = router;