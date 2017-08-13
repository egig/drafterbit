module.exports = {
	devServer: {
		contentBase: "./public",
		hot: true
	},
	entry: './build/client/index',
	output: {
		filename: 'public/bundle.js'
	}
};