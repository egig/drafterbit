const Cache = require('../lib/cache/Cache');
const RedisDriver = require('../lib/cache/RedisDriver');

function auth(config) {

	return function (req, res, next) {

		if([
				"/",
				"/_swagger_spec.json"
			].indexOf(req.path) === -1) {

			if(req.query.api_key !== config.get('ADMIN_API_KEY')) {
				return res.status(403).send("Access Denied");
			}

		}

		next();
	};
}

module.exports = auth;