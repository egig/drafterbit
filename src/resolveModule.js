const path = require('path');

function isRelative(filename) {
    return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
}

module.exports = function resolveModule(m, root) {
    if(path.isAbsolute(m)) {
        return m;
    }

    if(isRelative(m)) {
        return path.resolve(root, m);
    }

    // @todo ensure this return path across OS
    return require.resolve(m);
};