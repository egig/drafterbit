const getDbName  = require('../getDbName');

module.exports = function modelMiddleware() {
    return function (req, res, next) {

        let dbName = getDbName(req);
        req._dbName = dbName;
        
        let db = req.app.getDB();

        req.model = function (name) {
            return db.model(`${dbName}_${name}`);
        };

        next();
    };
};