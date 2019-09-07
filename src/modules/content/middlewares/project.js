const ContentTypeSchema  = require('../models/ContentType');
const ApiKeySchema  = require('../../auth/models/ApiKey');
const getProjectId  = require('./getProjectId');

module.exports = function projectMiddleware() {
    return function (req, res, next) {

        let projectId = getProjectId(req);
        req._projectId = projectId;
        
        let db = req.app.getDB(projectId);

        // Kick out model
        try {
            db.model(`${projectId}_ContentType`);
            db.model(`${projectId}_ApiKey`);
        } catch (error) {
            db.model(`${projectId}_ContentType`, ContentTypeSchema, '_content_types');
            db.model(`${projectId}_ApiKey`, ApiKeySchema, '_api_keys');
        }

        req.model = function (name) {
            return db.model(`${projectId}_${name}`);
        };

        if(['/',
                '/_swagger_spec.json'
            ].indexOf(req.path) !== -1) {
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
}