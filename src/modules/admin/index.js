const BaseModule = require('../../core/Module');
const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const createWebpackConfig = require('./client/webpack.config');

const DEBUG = true;

class AdminModule extends BaseModule {
    boot() {

        let webpackOutputPath = this.manager.app._root+"/build";

        let webpackConfig = createWebpackConfig({
            outputPath: webpackOutputPath
        });

        webpackConfig.output.path = webpackOutputPath;

        this.manager.app.use('/assets', express.static(webpackOutputPath));

        if(DEBUG) {
            const compiler = webpack(webpackConfig);
            this.manager.app.use(
                webpackDevMiddleware(compiler, {
                    publicPath: webpackConfig.output.publicPath,
                    writeToDisk: true
                })
            );
        }
    }
}

module.exports = AdminModule;