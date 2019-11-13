
const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const createWebpackConfig = require('./client/webpack.config');
const routes = require('./routes');

const DEBUG = true;

class AdminModule {

    constructor(app) {

        app.on('boot', () => {
            
            this.webpackOutputPath = app._root+'/build';            
            app.use('/', express.static(this.webpackOutputPath));

            if(DEBUG) {
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
                console.log('webpack compiling...');
            });
        });
    }

    prepareWebpackConfig(app, webpackOutputPath) {

        let webpackConfig = createWebpackConfig({
            outputPath: webpackOutputPath
        });

        webpackConfig.output.path = webpackOutputPath;

        // Insert module entries
        let clientEntryPoint = webpackConfig.entry.pop();
        app._modules.map(mo => {
            if(typeof mo.getAdminClientEntry == 'function') {
                webpackConfig.entry.push(mo.getAdminClientEntry());
            }
        });
        webpackConfig.entry.push(clientEntryPoint);
        return webpackConfig;
    }

    registerConfig(config) {

        config.use('admin', {
            type: 'literal',
            store: {
                'admin.api_base_url': '/',
                'admin.user_api_base_url': '/',
                'admin.api_key': '',
                'admin.user_api_key': '',
            }
        });
    }
}

module.exports = AdminModule;