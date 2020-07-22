export function slugify(str: string, separator: string='') {
    return str.toLowerCase().replace(/ +/g, separator)
        .replace(/[^\w-]+/g,'');
}