const minify = require('html-minifier').minify;
const fs = require('fs');
const path = require('path');
const Router = require('@koa/router');
let router = new Router();
import App from "../../../index";
import Koa from 'koa';

/**
 * s
 * @param ctx
 * @param asset
 */
function assetPath(ctx: App.Context, asset: any) {
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
router.get('/settings', async function (ctx: App.Context, next: Koa.Next) {

    try {
        let m = ctx.app.model('Setting');
        ctx.body = await m.getSettings();
    } catch (e) {
        ctx.status = 500;
        ctx.body = e.message;
    }

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
router.patch('/settings', function (ctx: App.Context, next: App.Next) {
    (async function () {

        try {
            let m = ctx.app.model('Setting');
            let results = await m.setSetting(ctx.request.body.fieldset_name, ctx.body);
            ctx.send(results);
        } catch (e) {
            console.log(e);
            ctx.status =500;
            ctx.body = e.message;
        }
    })();
});

router.get('/admin', function (ctx: App.Context, next: App.Next) {

    let assetsStr = fs.readFileSync(path.join(ctx.app.projectDir,'/build/assets.json'));
    const webpackAssets = JSON.parse(assetsStr.toString());

    let defaultState = {COMMON: {language: '', languages: []}};
    let config = ctx.app.get('config');

    let drafterbitConfig = {
        appName: config.get('APP_NAME'),
        debug: +config.get('DEBUG')
    };

    ctx.app.plugins().map(mo => {
        drafterbitConfig = Object.assign({}, drafterbitConfig, mo.registerClientConfig(config));
    });

    ctx.body = minify(`<!DOCTYPE html>
          <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                <link rel="stylesheet" type="text/css" href="${assetPath(ctx, webpackAssets.main.css)}" />
            </head>
            <body>
                <div id="app" ></div>
                <script>
                    window.__PRELOADED_STATE__=${JSON.stringify(defaultState)};
                    window.__PRELOADED_LANGUAGE_RESOURCES__=${JSON.stringify([])};
                    window.__DT_CONFIG__=${JSON.stringify(drafterbitConfig)};
                </script>
                <script src="${assetPath(ctx, webpackAssets.main.js)}"></script>
            </body>
        </html>`, { collapseWhitespace: true, minifyJS: true, minifyCSS: true });
});

module.exports = router.routes();