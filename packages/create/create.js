#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const copy = require('./lib/copy').default;
const prepare = require('./lib/prepare').default;
const install = require('./lib/install').default;

function log(...msg) {
    // eslint-disable-next-line no-console
    console.log(...msg);
}

function logError(...msg) {
    // eslint-disable-next-line no-console
    console.error(...msg);
}

(async() => {

    const spinner = ora('Prepare Project Dir...').start();
    try {

        let stub = path.join(__dirname, 'app/.');

        let installDir = process.argv[2];
        let projectDir = prepare(spinner, process.cwd(), installDir);
        spinner.succeed('Prepare project dir: '+projectDir);

        const spinner2 = ora('Creating Files...').start();
        try {

            copy(stub, projectDir, spinner2);
            spinner2.succeed('Creating Files.');

        } catch (e) {
            spinner2.fail('Creating Files.');
            logError(e);
        }

        const spinner3 = ora('Install Dependencies...').start();
        try {
            await install(spinner3, projectDir);
            spinner3.succeed('Install Dependencies.');

        } catch (e) {
            spinner3.fail('Install Dependencies.');
            logError(e);
        }

        log('');
        log(chalk.green('    Congratulation ! seems you\'ve successfully install drafterbit.'));
        let cmd = `cd ${projectDir} && npm run dev`;
        log(chalk.green(`    Now you can run ${chalk.bold(cmd)}`));
        log('');
        log(chalk.green('    Happy Hacking !'));
        log('');


    } catch (e) {
        spinner.fail('Install Failed');
        logError(e);
    }

})();