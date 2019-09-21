
const getProjectId  = require('../getProjectId');

module.exports = function modelMiddleware() {
    return function (req, res, next) {

        let projectId = getProjectId(req);
        req._projectId = projectId;
        
        let db = req.app.getDB(projectId);

        req.model = function (name) {
            return db.model(`${projectId}_${name}`);
        };

        next();
    };
};