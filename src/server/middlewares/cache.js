import Cache from '../lib/cache/Cache';
import RedisDriver from '../lib/cache/RedisDriver';

export default function cache(config) {
    return function (req, res, next) {

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