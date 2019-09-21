const ApiKeySchema  = require('../models/ApiKey');
const getProjectId  = require('../../../getProjectId');

module.exports = function apiKeyMiddleware() {
    return function (req, res, next) {

        let projectId = getProjectId(req);
        let db = req.app.getDB(projectId);

        // Kick out model
        try {
            db.model(`${projectId}_ApiKey`);
        } catch (error) {
            db.model(`${projectId}_ApiKey`, ApiKeySchema, '_api_keys');
        }

        req.model = function (name) {
            return db.model(`${projectId}_${name}`);
        };

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