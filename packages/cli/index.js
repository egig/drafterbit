#!/usr/bin/env node

const drafterbit = require('drafterbit')();

drafterbit.boot(process.cwd());

let program = drafterbit.get('cmd');

program.parse(process.argv);
if (program.debug) drafterbit.log.log(program.opts());