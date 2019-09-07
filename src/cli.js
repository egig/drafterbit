#!/usr/bin/env node

const program = require('commander');
const drafterbit = require('./index');

program
    .option('-d, --debug', 'output extra debugging')

program
    .command('start')
    .description('start server')
    .action(() => {

        let configFile = `${process.cwd()}/config.js`;
        drafterbit.boot(configFile);
        drafterbit.start(configFile)
    });

program
    .command('root')
    .description('find current project root')
    .action(() => {
        console.log(process.cwd())
    });

program.parse(process.argv);

if (program.debug) console.log(program.opts());;