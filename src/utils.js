function slugify(str, separator='') {
    return str.toLowerCase().replace(/ +/g, separator)
        .replace(/[^\w-]+/g,'');
}

module.exports = {
    slugify
};