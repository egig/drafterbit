const routes  = require('./routes');
const inquirer = require('inquirer');
const FieldType = require("@drafterbit/drafterbit/FieldType");
const fieldsToSchema = require("@drafterbit/drafterbit/fieldsToSchema");
const password = require("./lib/password");

class AuthModule {
    constructor(app) {
        app.on('routing', () => {
            app.use(routes);
        });
    }

    registerSchema(db) {
        // db.model('User', UserSchema, '_users');
    }

    getAdminClientEntry() {
        return this._modulePath+'/client/src/index.js';
    }

    config() {
        return {
            'USER_API_BASE_URL': '/',
            'USER_API_KEY': '',
        }
    }

    registerClientConfig(serverConfig) {
        return {
            userApiBaseURL: serverConfig.get('USER_API_BASE_URL'),
            userApiKey: serverConfig.get('USER_API_KEY')
        };
    }

    commands(app) {
        return [
            {
                command: "auth:init",
                description: "Init user auth",
                action: () => {

                    console.log("Welcome! Please provide email and password to create root user account.")
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
                                    return true
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
                                console.log("Password is not match please repeat");
                                process.exit(0);
                            }

                            return install(app, answers.email, answers.password)
                                .then(r => {
                                    console.log(r);
                                    process.exit(0)
                                });
                        })
                        .catch(error => {
                            console.error(error)
                            if(error.isTtyError) {
                                // Prompt couldn't be rendered in the current environment
                            } else {
                                // Something else when wrong
                            }
                        });
                }
            }
        ]
    }
}

function install(app, email, password) {

    let m = app.model("ContentType");

    return m.deleteMany({
        $or: [
            {slug: "users"},
            {slug: "groups"},
            {slug: "permissions"},
        ]
    }).then(r => {

        return createPermission(m)
            .then(r => {
                return createGroup(m);
            }).then(r => {
                return createUser(m, email, password, app);
            }).then(r => {
                console.log(r)
            }).catch(e => {
                console.error(e)
            })
    })
}

function createPermission(m) {
    return m.createContentType("Permission", "permissions", "", [{
        type_id: FieldType.SHORT_TEXT,
        name: "name",
        label: "Name",
        validation_rules: "required"
    },
        {
            type_id: FieldType.LONG_TEXT,
            name: "description",
            label: "Description",
            validation_rules: ""
        },
    ], true)
}

function createGroup(m) {
    return  m.createContentType("Group", "groups", "", [
        {
            type_id: FieldType.SHORT_TEXT,
            name: "name",
            label: "Name",
            validation_rules: "required"
        },
        {
            type_id: FieldType.LONG_TEXT,
            name: "description",
            label: "Description",
            validation_rules: ""
        },
        {
            type_id: FieldType.RELATION_TO_MANY,
            related_content_type_slug: "permissions",
            name: "permissions",
            label: "Permissions",
            validation_rules: "",
            show_in_list: false
        }
    ], true);
}

function createUser(m, email, passwordStr, app) {

    let userCollectionSlug = 'users';

    return m.createContentType("User", "users", "", [
        {
            type_id: FieldType.SHORT_TEXT,
            name: 'name',
            label: "Name",
            validation_rules: "required"
        },
        {
            type_id: FieldType.SHORT_TEXT,
            name: 'email',
            label: "Email",
            validation_rules: "required",
            unique: true
        },
        {
            type_id: FieldType.SHORT_TEXT,
            name: 'password',
            label: "Password",
            validation_rules: "required",
            show_in_list: false,
            show_in_form: false
        },
        {
            type_id: FieldType.RELATION_TO_MANY,
            related_content_type_slug: "groups",
            name: "groups",
            label: "Groups",
            validation_rules: "",
            show_in_list: false
        }
    ], true)
        .then(r => {

            return m.getContentType(userCollectionSlug);

        })
        .then(contentType => {

            let schemaObj = fieldsToSchema.getSchema(contentType.fields);

            let userModel;
            try {
                userModel = app.getDB().model(userCollectionSlug);
            } catch (error) {
                userModel = app.getDB().model(userCollectionSlug, schemaObj, userCollectionSlug);
            }

            return password.hash(passwordStr)
                .then(hashedPassword=> {
                    return userModel.create({
                        email: email,
                        password: hashedPassword
                    }).then(r => {
                        console.log(r)
                    })
                })
        });
}

module.exports = AuthModule;