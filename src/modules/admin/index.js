
const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const createWebpackConfig = require('./client/webpack.config');
const routes = require('./routes');

const DEBUG = true;

module.exports = function (app) {

    let webpackOutputPath = app._root+'/build';

    let webpackConfig = createWebpackConfig({
        outputPath: webpackOutputPath
    });

    webpackConfig.output.path = webpackOutputPath;
    const compiler = webpack(webpackConfig);

    app.on('boot', () => {

        app.use('/', express.static(webpackOutputPath));

        if(DEBUG) {
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

    app.on('build', function () {

        compiler.run((err, stats) => {
            console.log('webpack compiling...');
        });
    });
};