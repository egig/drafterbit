const ApiKeySchema  = require('../models/ApiKey');
const getDbName  = require('../../../getDbName');

module.exports = function apiKeyMiddleware() {
    return function (req, res, next) {

        let dbName = getDbName(req);
        let db = req.app.getDB(dbName);

        // Kick out model
        try {
            db.model(`${dbName}_ApiKey`);
        } catch (error) {
            db.model(`${dbName}_ApiKey`, ApiKeySchema, '_api_keys');
        }

        // TODO get this from config
        let excludePattern = [
            '^\/$',
            '^\/(css|js|img|fonts|locales)\/(.+)',
            '^/favicon.ico',
            '/swagger.json'
        ];

        let match = false;
        for (let i=0;i<excludePattern.length;i++) {
            let pattern = excludePattern[i];
            let re = new RegExp(pattern);
            if(re.test(req.path)) {
                match = true;
                break;
            }
        }

        if(match) {
            return next();
        }

        let apiKey = req.query['api_key'];

        let Model = req.model('ApiKey');

        Model.getApiKeyByKey(apiKey)
            .then(apiK => {

                if(!apiK) {
                    let config = req.app.get('config');
                    // Last chance, check if its the admin api key
                    if(apiKey !== config.get('ADMIN_API_KEY')) {
                        return res.status(403).send('Access Denied');
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            })
            .catch(next);
    };
};