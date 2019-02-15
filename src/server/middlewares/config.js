module.exports = function (config) {
	return function (req, res, next) {
		req.app.set('config', config);
		next()
	}
}