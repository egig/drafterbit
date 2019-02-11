module.exports = function (req, res, next) {
    if(typeof req.session.user !== 'undefined') {
        req.user = req.session.user;
    } else {
        req.user = false;
    }

    next();
} 