#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const execa = require('execa');
const chalk = require('chalk');

function log(...msg) {
    // eslint-disable-next-line no-console
    console.log(...msg);
}

function logError(...msg) {
    // eslint-disable-next-line no-console
    console.error(...msg);
}

function copy(srcDir, dstDir) {

    let list = fs.readdirSync(srcDir);
    let src, dst;

    function skip(file) {
        return /.*node_modules.*/.test(file) || /.env$/.test(file)
            || /package-lock.json$/.test(file);
    }

    list.forEach(function(file) {
        src = path.join(srcDir,file);
        dst = path.join(dstDir,file);

        if (skip(file)) {
            return;
        }

        let stat = fs.statSync(src);
        if (stat && stat.isDirectory()) {
            try {
                log(chalk.green('CREATE FILE: ') + dst);
                fs.mkdirSync(dst);
            } catch(e) {
                log(chalk.red('cannot create dir: ') + dst);
                logError(e);
            }

            return copy(src, dst);
        }

        try {
            log(chalk.green('CREATE FILE: ') + dst);
            fs.writeFileSync(dst, fs.readFileSync(src));
        } catch(e) {
            log(chalk.red('could\'t copy file: ') + dst);
            logError(e);
        }
    });
}

function runInstall(wd) {
    return execa('npm', ['install', '--only=prod', '--no-fund'], {
        cwd: wd
    })
}

(async() => {

    try {

        let destDir = process.cwd();
        let argv2 = process.argv[2];
        if (argv2 !== undefined) {
            destDir = path.join(process.cwd(), argv2);
            if (fs.existsSync(destDir)) {
                let fileList = fs.readdirSync(destDir);
                if (fileList.length >= 1) {
                    logError(chalk.red(`Directory ${destDir} is not empty !`));
                    process.exit(1)
                }
            } else {
                log('creating app dir', destDir);
                mkdirp.sync(destDir);
            }
        }

        let stubDir = __dirname;
        let stub = path.join(stubDir, 'app/.');

        copy(stub, destDir);
        log(chalk.green('INSTALLING DEPENDENCIES...'));
        let{stdout} = await runInstall(destDir);
        stdout.split("\n").map(line => {
            if (line.trim() !== "") log(chalk.green("NPM INSTALL: ")+(line));
        });

        log("");
        log(chalk.green('          Congratulation ! seems you\'ve successfully install drafterbit.'));

        let cmd = `npm run dev`;
        if (argv2 !== undefined) {
            cmd = `cd ${path.basename(destDir)} && npm run dev`;
            log(chalk.green(`                   Now you can run ${chalk.bold(cmd)}`));
        } else {
            log(chalk.green(`                       Now you can run ${chalk.bold(cmd)}`));
        }
        log("");
        log(chalk.green("                               Happy Hacking !"));
        log("");


    } catch (e) {
        logError(e)
    }

})();