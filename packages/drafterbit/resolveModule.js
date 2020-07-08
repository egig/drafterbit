const path = require('path');

function isRelative(filename) {
    return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
}

function isDTModule(filePath) {
    return (filePath.indexOf('drafterbit') === 0);
}

module.exports = function resolveModule(m, root) {
    if(isDTModule(m)){
        m = m.replace(/^drafterbit/gi, __dirname)
    }

    if(path.isAbsolute(m)) {
        return {
            isAbsolute: true,
            resolvedPath: m
        };
    }

    if(isRelative(m)) {
        return {
            isRelative: true,
            resolvedPath: path.resolve(root, m)
        };
    }

    // @todo ensure this return path across OS
    try {
        let resolvedPath = path.dirname(require.resolve(m));
        return {
            resolvedPath: resolvedPath
        };
    } catch (e) {
        if (e instanceof Error && e.code === 'MODULE_NOT_FOUND')
            return {
                resolvedPath: m
            };
        else
            throw e;
    }
};