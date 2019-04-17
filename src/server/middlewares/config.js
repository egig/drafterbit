export default function config(cfg) {
    return function (req, res, next) {
        req.app.set('config', cfg);
        next();
    };
};