const inquirer = require('inquirer');
const FieldType = require('@drafterbit/common/FieldType');
const fieldsToSchema = require('@drafterbit/common/fieldsToSchema');
const password = require('./lib/password');

module.exports = [
    {
        command: 'install',
        description: 'Install app data',
        createAction: app => {
            return () => {

                console.log('Welcome! Please provide email and password to create root user account.');
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'email',
                            message: 'Email:',
                            validate: function(value) {
                                // TODO validate email
                                // var valid = !isNaN(parseFloat(value));
                                // return valid || 'Please enter a number';
                                return true;
                            },
                            filter: String
                        },
                        {
                            type: 'password',
                            name: 'password',
                            message: 'Password:'
                        },
                        {
                            type: 'password',
                            name: 'password_confirm',
                            message: 'Password Confirm:'
                        },
                    ])
                    .then(answers => {

                        if (answers.password !== answers.password_confirm) {
                            console.log('Password is not match please repeat');
                            process.exit(0);
                        }

                        // TODO using transactions
                        return install(app, answers.email, answers.password)
                            .then(r => {
                                console.log(r);
                                process.exit(0);
                            });
                    })
                    .catch(error => {
                        console.error(error);
                        if(error.isTtyError) {
                            // Prompt couldn't be rendered in the current environment
                        } else {
                            // Something else when wrong
                        }
                    });
            };
        }
    }
];

function install(app, email, password) {

    let m = app.model('Type');

    return m.deleteMany({
        $or: [
            {name: 'User'},
            {name: 'Group'},
            {name: 'Permission'},
        ]
    }).then(r => {

        return createPermission(m)
            .then(r => {
                return createGroup(m);
            }).then(r => {
                return createUser(m, email, password, app);
            }).then(r => {
                return installSettings(app);
            }).then(r => {
                return installPrimitives(app);
            }).then(r => {
                console.log(r);
            }).catch(e => {
                console.error(e);
            });
    });
}

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

function createPermission(m) {
    let name = 'Permission';
    let slug = 'permissions';
    let displayText = 'Permission';
    let description = '';
    let hasFields = true;
    let fields = [{
        type_name: FieldType.SHORT_TEXT,
        name: 'name',
        label: 'Name',
        validation_rules: 'required'
    },
        {
            type_name: FieldType.LONG_TEXT,
            name: 'description',
            label: 'Description',
            validation_rules: ''
        },
    ];

    return m.createType(name, slug, displayText, description, hasFields, fields);
}

function createGroup(m) {

    let name = 'Group';
    let slug = 'groups';
    let displayText = 'Group';
    let description = '';
    let hasFields = true;
    let fields = [
        {
            type_name: FieldType.SHORT_TEXT,
            name: 'name',
            label: 'Name',
            validation_rules: 'required'
        },
        {
            type_name: FieldType.LONG_TEXT,
            name: 'description',
            label: 'Description',
            validation_rules: ''
        },
        {
            type_name: 'Permission',
            multiple: true,
            name: 'permissions',
            label: 'Permissions',
            validation_rules: '',
            show_in_list: false
        }
    ];

    return m.createType(name, slug, displayText, description, hasFields, fields);
}

function createUser(m, email, passwordStr, app) {

    let name = 'User';
    let slug = 'users';
    let displayText = 'User';
    let description = '';
    let hasFields = true;
    let fields = [
        {
            type_name: FieldType.SHORT_TEXT,
            name: 'name',
            label: 'Name',
            validation_rules: 'required'
        },
        {
            type_name: FieldType.SHORT_TEXT,
            name: 'email',
            label: 'Email',
            validation_rules: 'required',
            unique: true
        },
        {
            type_name: FieldType.SHORT_TEXT,
            name: 'password',
            label: 'Password',
            validation_rules: 'required',
            show_in_list: false,
            show_in_form: false
        },
        {
            type_name: 'Group',
            name: 'groups',
            label: 'Groups',
            multiple: true,
            validation_rules: '',
            show_in_list: false
        }
    ];

    return m.createType(name, slug, displayText, description, hasFields, fields)
        .then(r => {
            return m.getType('User');

        })
        .then(type => {

            let schemaObj = fieldsToSchema.getSchema(type.fields);

            let userModel;
            try {
                userModel = app.getDB().model('User');
            } catch (error) {
                userModel = app.getDB().model('User', schemaObj);
            }

            return password.hash(passwordStr)
                .then(hashedPassword=> {
                    return userModel.create({
                        email: email,
                        password: hashedPassword
                    }).then(r => {
                        console.log(r);
                    });
                });
        });
}
