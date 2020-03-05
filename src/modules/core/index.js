const webpack = require('webpack');
const express = require('express');
const createWebpackConfig = require('./client/webpack.config');
const routes = require('./routes');
const Module = require('../../Module');

class CoreModule extends Module {

    constructor(app) {
        super(app);

        app.on('pre-start', () => {
            
            this.webpackOutputPath = app.get('config').get('ROOT_DIR')+'/build';
            app.use('/', express.static(this.webpackOutputPath));

            if(app.get('config').get('NODE_ENV') !== "production") {
                const webpackDevMiddleware = require('webpack-dev-middleware');

                let webpackConfig = this.prepareWebpackConfig(app, this.webpackOutputPath);
                const compiler = webpack(webpackConfig);
                app.use(
                    webpackDevMiddleware(compiler, {
                        publicPath: webpackConfig.output.publicPath,
                        writeToDisk: true
                    })
                );
            }
        });

        app.on('routing', function () {
            app.use(routes);
        });

        app.on('build', () => {

            let webpackConfig = this.prepareWebpackConfig(app, this.webpackOutputPath);
            const compiler = webpack(webpackConfig);

            compiler.run((err, stats) => {
                console.log('Webpack build done.');
                process.exit(0);
            });
        });
    }

    prepareWebpackConfig(app, webpackOutputPath) {

        let isProduction = (app.get('config').get('NODE_ENV') === 'production');

        let webpackConfig = createWebpackConfig({
            outputPath: webpackOutputPath,
            production: isProduction
        });

        webpackConfig.output.path = webpackOutputPath;

        // Insert module entries
        let clientEntryPoint = webpackConfig.entry.pop();
        console.log("Number of modules:", app._modules.length);
        app._modules.map(mo => {
            if(typeof mo.getAdminClientEntry == 'function') {
                webpackConfig.entry.push(mo.getAdminClientEntry());
            }
        });
        webpackConfig.entry.push(clientEntryPoint);
        return webpackConfig;
    }

    config() {
        return {
            'API_BASE_URL': '/',
            'API_KEY': ''
        }
    }

    registerClientConfig(serverConfig) {
        return {
            apiBaseURL: serverConfig.get('API_BASE_URL'),
            apiKey: serverConfig.get('API_KEY'),
        };
    }

    getAdminClientEntry() {
        return this._modulePath+'/client/src/modules/common/index.js';
    }

    commands(app) {
        return [
            {
                command: "start",
                description: "start server",
                action: () => {
                    app.start();
                }
            },
            {
                command: "build",
                description: "build the app",
                action: () => {
                    app.build();
                }
            },
        ]
    }
}

module.exports = CoreModule;