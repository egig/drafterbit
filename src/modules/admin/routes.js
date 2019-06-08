import fs from 'fs';

import express from 'express';
import webpack from 'webpack';

import defaultState from './defaultState';
import webpackConfig from './webpack.config';

let router = express.Router();

const ASSETS_STAT_PATH = webpackConfig.output.path+'/assets.stat.json';

function doCompileWebPack() {
    if(fs.existsSync(ASSETS_STAT_PATH)) {
        return getStat(ASSETS_STAT_PATH);
    } else {
        return compileWebpack()
            .then(stats => {
                let statObj = {
                    hash: stats.hash
                };
                return writeStat(webpackConfig.output.path + '/assets.stat.json', JSON.stringify(statObj))
                    .then(() => {
                        return stats;
                    });
            });
    }
}

function getStat(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, function (err, cnt) {
            if (err) return reject(err);
            return resolve(JSON.parse(cnt));
        });
    });
}

function writeStat(filePath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, (err) => {
            if(err) return reject(err);
            return resolve(true);
        });
    });
}

function compileWebpack() {
    return new Promise((resolve, reject) => {

        // TODO optimize this for production
        webpack(webpackConfig, (err, stats) => { // Stats Object

	          const info = stats.toJson();

            if (err || stats.hasErrors()) {

                if (err) {
                    console.error(err.stack || err);
                    if (err.details) {
                        console.error(err.details);
                    }
                    return reject(err);
                }

                if (stats.hasErrors()) {
                    console.error(info.errors);
                    return reject(info.errors);
                }

            } else {

                if (stats.hasWarnings()) {
                    console.warn(info.warnings);
                }
                return resolve(stats);
            }

        });

    });
}

router.get('/admin', function (req, res) {

    defaultState.COMMON.language = req.language;
    defaultState.COMMON.languages = req.languages;

    if(req.user) {
        defaultState.USER.currentUser = req.user;
    } else {
        defaultState.USER.currentUser = undefined;
    }

    let drafterbitConfig = {
        apiBaseURL: req.app.get('config').get('API_BASE_URL')
    };

    doCompileWebPack()
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


module.exports = router;