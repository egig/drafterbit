/**
 *  TODO move this to module
 *
 * @param fqStr
 */
function parseFilterQuery(fqStr) {

    if(!fqStr) {
        return {};
    }

    return fqStr.split(';').map((s) => {
        let t = s.split(':');
        return {
            k: t[0],
            v: t[1]
        };
    }).reduce((acc, curr) => {
        acc[curr.k] = curr.v;
        return acc;
    }, {});
}


/**
 *  TODO move this to module
 *
 * @param fqObj
 */
function stringifyFilterQuery(fqObj) {

    let fL = [];
    Object.keys(fqObj).forEach((k) => {
        fL.push(`${k}:${fqObj[k]}`);
    });

    return fL.join(';');
}

/**
 *
 * @param oldObj
 * @param newObj
 */
function mergeFilterObj(oldObj, newObj) {
    Object.keys(newObj).forEach((k) => {
        if ( typeof oldObj[k] !== 'undefined') {
            oldObj[k] = [oldObj[k]];
            oldObj[k].push(newObj[k])
        } else {
            oldObj[k] = newObj[k]
        }
    });

    return oldObj
}

module.exports = {
    stringifyFilterQuery,
    parseFilterQuery,
    mergeFilterObj
};