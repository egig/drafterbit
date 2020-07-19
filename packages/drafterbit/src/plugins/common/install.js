module.exports = function install(app) {
    return Promise.all([
        installPrimitives(app),
        installSettings(app)
    ])
};

function installPrimitives(app) {
    let primitives = [
        { name: 'ShortText', slug: 'short-text', displayText: "Short Text"},
        { name: 'LongText',  slug: 'long-text', displayText: "Long Text"},
        { name: 'RichText',  slug: 'rich-text', displayText: "Rich Text"},
        { name: 'Number',  slug: 'numbers', displayText: "Number"},
    ];

    let m = app.model('Type');
    let createTypes = primitives.map(t => {
        return m.createType(t.name, t.slug, t.displayText, "", false, []);
    });

    return Promise.all(createTypes);
}

function installSettings(app) {
    let m = app.model('Setting');
    return m.setSetting('General', {
        "app_name": "Awesome app",
        "enable_register": false,
        "enable_reset_password": false,
        "brand_img_url": "/img/app_name_here.png"
    });
}