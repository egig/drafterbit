const Cache = require('../lib/Cache');
const RedisDriver = require('../lib/RedisDriver');

function cache(config) {
    return function (req, res, next) {

        if (!!req.app.get('cache')) {
            return next()
        }

        const redisDriver = new RedisDriver({
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
            db: config.get('REDIS_DB'),
            prefix: 'dt'
        });

        const cache = new Cache(redisDriver);
        req.app.set('cache', cache);

        next();
    };
}

module.exports = cache;