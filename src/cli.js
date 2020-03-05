#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const drafterbit = require('./index')();

program
    .option('-d, --debug', 'output extra debugging');

program
    .command('start')
    .description('start server')
    .action(() => {
        drafterbit.boot(process.cwd());
        drafterbit.start();
    });

program
    .command('build')
    .description('build the app')
    .action(() => {
        drafterbit.boot(process.cwd());
        drafterbit.build();
    });
program
    .command('init')
    .description('initialize things')
    .action(() => {
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

                drafterbit.boot(process.cwd());
                return drafterbit.install(answers.email, answers.password)
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

    });

program.parse(process.argv);

if (program.debug) console.log(program.opts());