const ContentTypeSchema  = require('../models/ContentType');
const getProjectId  = require('../../../getProjectId');

module.exports = function projectMiddleware() {
    return function (req, res, next) {

        let projectId = getProjectId(req);
        req._projectId = projectId;
        
        let db = req.app.getDB(projectId);

        // Kick out model
        try {
            db.model(`${projectId}_ContentType`);
        } catch (error) {
            db.model(`${projectId}_ContentType`, ContentTypeSchema, '_content_types');
        }

        next();
    };
};