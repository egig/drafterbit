const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = env => {

    console.log('Build output path: ', env.outputPath);

    let commonConfig = {
        entry: [ '@babel/polyfill', __dirname+'/src/init.js', __dirname+'/src/index.js'],
        output: {
            path: env.outputPath,
            filename: 'js/[name].[hash].js',
            publicPath: '/',
            chunkFilename: 'js/[chunkhash].[hash].js'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include: [
                        path.resolve(env.projectRoot, 'node_modules/@drafterbit'),
                        path.resolve(env.projectRoot, 'packages'),
                    ],
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env', '@babel/preset-react'],
                                plugins: [
                                    '@babel/plugin-proposal-class-properties',
                                    '@babel/plugin-syntax-dynamic-import',
                                    'babel-plugin-styled-components'
                                ]
                            }
                        },
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {importLoaders: 1},
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: __dirname + '/postcss.config.js'
                                }
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts'
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack', 'url-loader']
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: 'css/[name].[hash].css',
                chunkFilename: 'css/[chunkhash].[hash].css'
            }),
            new CopyPlugin([
                // {from: "public"},
                {from: __dirname+'/public/img', to: 'img'},
                {from: __dirname+'/public/locales', to: 'locales'},
                {from: __dirname+'/public/favicon.ico', to: 'favicon.ico'}
            ]),
            new AssetsPlugin({path: env.outputPath, filename: 'assets.json'})
        ],
        resolve: {
            extensions: ['*', '.js', '.jsx', '.css']
        },
    };


    if(!!env && env.production) {
        return merge(commonConfig, {
            mode: 'production',
            devtool: 'source-map'
        });
    }

    return merge(commonConfig, {
        mode: 'development',
        // devtool: "inline-source-map", this is slow !!
        devServer: {
            disableHostCheck: true,
            writeToDisk: true
        }
    });
};