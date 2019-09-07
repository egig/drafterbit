
const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const createWebpackConfig = require('./client/webpack.config');
const routes = require('./routes');

const DEBUG = true;

module.exports = function (app) {

    app.on("boot", () => {

        let webpackOutputPath = app._root+"/build";

        let webpackConfig = createWebpackConfig({
            outputPath: webpackOutputPath
        });

        webpackConfig.output.path = webpackOutputPath;

        app.use('/assets', express.static(webpackOutputPath));

        if(DEBUG) {
            const compiler = webpack(webpackConfig);
            app.use(
                webpackDevMiddleware(compiler, {
                    publicPath: webpackConfig.output.publicPath,
                    writeToDisk: true
                })
            );
        }
    });

    app.on("routing", function () {
        app.use(routes)
    })
};