const ContentTypeSchema  = require('../models/ContentType');
const getDbName  = require('../../../getDbName');

module.exports = function contentTypeMiddleware() {
    return function (req, res, next) {

        let dbName = getDbName(req);
        req._dbName = dbName;
        
        let db = req.app.getDB();

        // Kick out model
        try {
            db.model(`${dbName}_ContentType`);
        } catch (error) {
            db.model(`${dbName}_ContentType`, ContentTypeSchema, '_content_types');
        }

        next();
    };
};