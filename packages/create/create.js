#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const execa = require('execa');
const chalk = require('chalk');
const ora = require('ora');

function log(...msg) {
    // eslint-disable-next-line no-console
    console.log(...msg);
}

function logError(...msg) {
    // eslint-disable-next-line no-console
    console.error(...msg);
}

function doCopy(srcDir, dstDir, spinner) {
    return new Promise((resolve,reject) => {
        try {
            copy(srcDir, dstDir, spinner);
            resolve();
        } catch (e) {
            reject(e)
        }
    })
}

function copy(srcDir, dstDir, spinner) {

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
                spinner.text = 'Creating Files: '+ dst;
                fs.mkdirSync(dst);
            } catch(e) {
                throw e;
            }

            return copy(src, dst, spinner);
        }

        try {
            spinner.text = 'Creating Files: '+ dst;
            fs.writeFileSync(dst, fs.readFileSync(src));
        } catch(e) {
            throw e
        }
    });
}

function runInstall(wd, spinner) {
    let proc = execa('npm', ['install', '--only=prod', '--no-fund', "-d"], {
        cwd: wd
    });

    proc.stdout.on("data", (chunk) => {
        spinner.text = chunk
    });

    return proc;
}


function prepareProjectDir(spinner) {
    return new Promise((resolve, reject) => {

        let destDir = process.cwd();
        let argv2 = process.argv[2];
        if (argv2 === undefined) {
            return Promise.resolve(destDir);
        }

        destDir = path.join(process.cwd(), argv2);

        fs.stat(destDir, function(err, stat) {
            if(err == null) {
                fs.readdir(destDir, (err, files) => {
                    if (files.length >= 1) {
                        return reject(`Directory ${destDir} is not empty !`);
                    }
                    return resolve(destDir);
                });

            } else if(err.code === 'ENOENT') {
                spinner.text = "Create app dir: "+destDir;
                return mkdirp(destDir).then(() => {
                    return resolve(destDir)
                })
            } else {
                return reject(err)
            }
        });

    });
}

(async() => {


    const spinner = ora('Prepare Project Dir...').start();
    try {

        let stubDir = __dirname;
        let stub = path.join(stubDir, 'app/.');

        let projectDir = await prepareProjectDir(spinner);
        spinner.succeed("Prepare project dir: "+projectDir);

        const spinner2 = ora('Creating Files...').start();
        try {

            let a = await doCopy(stub, projectDir, spinner2);
            spinner2.succeed("Creating Files.")

        } catch (e) {
            spinner2.fail("Creating Files.");
            logError(e)
        }

        const spinner3 = ora('Install Dependencies...').start();
        try {

            let { stdout } = await runInstall(projectDir, spinner3);
            spinner3.succeed("Install Dependencies.")

        } catch (e) {
            spinner3.fail("Install Dependencies.");
            logError(e)
        }

        log("");
        log(chalk.green('    Congratulation ! seems you\'ve successfully install drafterbit.'));
        let cmd = `cd ${projectDir} && npm run dev`;
        log(chalk.green(`    Now you can run ${chalk.bold(cmd)}`));
        log("");
        log(chalk.green("    Happy Hacking !"));
        log("");


    } catch (e) {
        spinner.fail("Install Failed");
        logError(e)
    }

})();