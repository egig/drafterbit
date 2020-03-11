#!/usr/bin/env node

const drafterbit = require('./index')();

drafterbit.boot(process.cwd());
let program = drafterbit.get('cmd');

program.parse(process.argv);
if (program.debug) console.log(program.opts());