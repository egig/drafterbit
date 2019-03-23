const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: 'development',
	entry: ['babel-polyfill', './src/client/index.js'],
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'],
							plugins: ['@babel/plugin-proposal-class-properties']
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
							publicPath: __dirname + '/../../public/css/'
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
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].css",
			chunkFilename: "[id].css"
		})
	],
	resolve: {
		extensions: ['*', '.js', '.jsx', '.css']
	},
};