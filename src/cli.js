#!/usr/bin/env node

const program = require('commander');
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
    .command('initdb')
    .description('initialize DB things')
    .action(() => {
        drafterbit.boot(process.cwd());
        drafterbit.initContentTypes().catch(e => console.error(e))
        process.exit(0)
    });

program.parse(process.argv);

if (program.debug) console.log(program.opts());