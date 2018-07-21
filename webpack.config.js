module.exports = {
	devServer: {
		contentBase: "./public",
		hot: true
	},
	entry: ['babel-polyfill', './build/client/index'],
	output: {
		filename: 'public/bundle.js'
	},
	node: {
		fs: 'empty',
		XMLHttpRequest: 'empty',
		child_process: 'empty',
		existsSync: 'empty'
	}
};