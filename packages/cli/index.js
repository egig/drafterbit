#!/usr/bin/env node

const drafterbit = require('drafterbit')();

drafterbit.boot(process.cwd());

let program = drafterbit.get('cmd');

program.on('command:*', function (operands) {
    console.error(`Error: unknown command '${operands[0]}'`);
    program.help();
    process.exitCode = 1;
})
    .parse(process.argv);

if (process.argv.length <= 2) {
    program.help();
}

if (program.debug) {
    drafterbit.logger.log(program.opts());
}