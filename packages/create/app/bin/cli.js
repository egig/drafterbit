#!/usr/bin/env node

let drafterbit = require('../app');

drafterbit.boot(process.cwd());

let program = drafterbit.get('cmd');

program.parse(process.argv);
if (program.debug) console.log(program.opts());