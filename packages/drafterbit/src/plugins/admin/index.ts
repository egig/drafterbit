import path from 'path';
import webpack from 'webpack';
import serve from 'koa-static';
import Plugin from '../../Plugin';
import SettingSchema from './models/Setting';
import koaWebpack from 'koa-webpack';

const createWebpackConfig = require('./client-side/webpack.config');

class AdminPlugin extends Plugin {

    webpackOutputPath: string;

    constructor(app: any) {
        super(app);

        this.webpackOutputPath = path.join(app.projectDir, 'build');
        app.use(serve(this.webpackOutputPath));

        // TODO supports hmr
        // app.on('pre-start', async () => {
        //     if(app.get('config').get('NODE_ENV') !== 'production') {
        //         //
        //         let webpackConfig = this.prepareWebpackConfig(app, this.webpackOutputPath);
        //         const compiler = webpack(webpackConfig);
        //         const middleware = await koaWebpack({
        //             compiler,
        //             devMiddleware: {
        //                 publicPath: webpackConfig.output.publicPath,
        //                 writeToDisk: true
        //             }
        //         });
        //         app.use(middleware);
        //     }
        //
        // });

        app.on('build', () => {

            let webpackConfig = this.prepareWebpackConfig(app, this.webpackOutputPath);
            const compiler = webpack(webpackConfig);

            compiler.run((err: any, stats: Object) => {
                console.log('Webpack build done.');
                process.exit(0);
            });
        });
    }

    prepareWebpackConfig(app: any, webpackOutputPath: string) {

        let isProduction = (app.get('config').get('NODE_ENV') === 'production');

        let modulePaths = app.plugins().map((mo:Plugin) => mo.getPath());
        let webpackConfig = createWebpackConfig({
            outputPath: webpackOutputPath,
            production: isProduction,
            projectRoot: app.projectDir,
            modulePaths: modulePaths
        });

        webpackConfig.output.path = webpackOutputPath;

        // Insert module entries
        let clientEntryPoint = webpackConfig.entry.pop();
        console.log('Number of plugins:', app.plugins().length);
        app.plugins().map((mo: Plugin) => {
            let entry = mo.getAdminClientSideEntry();
            if (entry) {
                webpackConfig.entry.push(entry);
            }
        });
        webpackConfig.entry.push(clientEntryPoint);
        return webpackConfig;
    }

    registerClientConfig(serverConfig: any) {
        return {
            apiBaseURL: serverConfig.get('API_BASE_URL'),
            apiKey: serverConfig.get('API_KEY'),
        };
    }

    getAdminClientSideEntry() {
        return false;
    }

    registerSchema(db: any) {
        db.model('Setting', SettingSchema, '_settings');
    }
}

module.exports = AdminPlugin;