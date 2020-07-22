import Application from "../../index";
import FieldType from '@drafterbit/common/dist/FieldType';
import password from './lib/password';

const inquirer = require('inquirer');
const fieldsToSchema = require('@drafterbit/common/dist/fieldsToSchema');

module.exports = function install(app: Application) {
    return promptAndInstall(app)
};

function promptAndInstall(app: Application) {
    console.log('Welcome! Please provide email and password to create root user account.');
    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'email',
                message: 'Email:',
                validate: function() {
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
        .then((answers: any) => {

            if (answers.password !== answers.password_confirm) {
                console.log('Password is not match please repeat');
                process.exit(0);
            }

            // TODO using transactions
            return diInstall(app, answers.email, answers.password)

        })
        .catch((error: any) => {
            console.error(error);
            if(error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else when wrong
            }
        });
}

function diInstall(app: Application, email: string, password: string) {
    let m = app.model('Type');

    return m.deleteMany({
        $or: [
            {name: 'User'},
            {name: 'Group'},
            {name: 'Permission'},
        ]
    }).then(() => {

        return createPermission(m)
            .then(() => {
                return createGroup(m);
            }).then(() => {
                return createUser(m, email, password, app);
            }).catch((e: any) => {
                console.error(e);
            });
    });
}

function createPermission(m: any) {
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

function createGroup(m: any) {

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

function createUser(m: any, email: string, passwordStr: string, app: Application) {

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
        .then(() => {
            return m.getType('User');

        })
        .then((type: any) => {

            let schemaObj = fieldsToSchema.getSchema(type.fields);

            let userModel: any;
            try {
                userModel = app.odm().model('User');
            } catch (error) {
                userModel = app.odm().model('User', schemaObj);
            }

            return password.hash(passwordStr)
                .then((hashedPassword: any) => {
                    return userModel.create({
                        email: email,
                        password: hashedPassword
                    })
                });
        });
}