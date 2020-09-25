#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const mkdirp = require('mkdirp');

let destDir = process.cwd();
let argv2 = process.argv[2];

function log(...msg) {
    // eslint-disable-next-line no-console
    console.log(...msg);
}

function logError(...msg) {
    // eslint-disable-next-line no-console
    console.error(...msg);
}


if (argv2 !== undefined) {
    destDir = path.join(process.cwd(), argv2);
    log('creating app dir', destDir);
    mkdirp.sync(destDir);
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
                log('creating dir: ' + dst);
                fs.mkdirSync(dst);
            } catch(e) {
                log('cannot create dir: ' + dst);
                logError(e);
            }

            return copy(src, dst);
        }

        try {
            log('copying file: ' + dst);
            fs.writeFileSync(dst, fs.readFileSync(src));
        } catch(e) {
            log('could\'t copy file: ' + dst);
            logError(e);
        }
    });
}

let stubDir = __dirname;
let stub = path.join(stubDir, 'app/.');

copy(stub, destDir);
shell.exec(`cd ${destDir} && npm install`);