const express = require('express');
const minify = require('html-minifier').minify;
const fs = require('fs');

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

/**
 * @swagger
 * /settings:
 *   get:
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /settings
 */
router.get("/settings", function (req, res) {
    (async function () {

        try {
            let m = req.app.model('Setting');
            let results = await m.getSettings();
            res.send(results);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        }

    })();
});

/**
 * @swagger
 * /settings:
 *   patch:
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /settings
 */
router.patch("/settings", function (req, res) {
    (async function () {

        try {
            let m = req.app.model('Setting');
            let results = await m.setSetting(req.body.fieldset_name, req.body);
            res.send(results);
        } catch (e) {
            console.log(e)
            res.status(500);
            res.send(e.message);
        }

    })();
});

router.get('/', function (req, res) {

    let assetsStr = fs.readFileSync(req.app.get('config').get('ROOT_DIR')+'/build/assets.json');
    const webpackAssets = JSON.parse(assetsStr.toString());

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