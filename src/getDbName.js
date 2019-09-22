
/**
 *
 * @param req
 */
module.exports = function getDbName(req) {

    // First, lets check the subdomain
    let projectId = req.subdomains.pop();
    if(projectId) {
        return projectId;
    }

    // Lets try the query string
    projectId = req.query['project_id'];
    if(projectId) {
        return projectId;
    }

    // we should set in the config then;
    return req.app.get('config').get('MONGODB_NAME');
};