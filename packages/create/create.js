#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const mkdirp = require('mkdirp');

let destDir = process.cwd();
let argv2 = process.argv[2];
if (argv2 !== undefined) {
    destDir = path.join(process.cwd(), argv2);
    console.log("creating app dir", destDir);
    mkdirp.sync(destDir);
}

function copy(srcDir, dstDir) {

    let list = fs.readdirSync(srcDir);
    let src, dst;

    function skip(file) {
        return /.*node_modules.*/.test(file) || /.env$/.test(file)
            || /package-lock.json$/.test(file)
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
                console.log('creating dir: ' + dst);
                fs.mkdirSync(dst);
            } catch(e) {
                console.log('cannot create dir: ' + dst);
                console.error(e)
            }

            return copy(src, dst);
        }

        try {
            console.log('copying file: ' + dst);
            fs.writeFileSync(dst, fs.readFileSync(src));
        } catch(e) {
            console.log('could\'t copy file: ' + dst);
            console.error(e)
        }
    });
}

let stubDir = __dirname;
let stub = path.join(stubDir, "app/.");

copy(stub, destDir);
shell.exec(`cd ${destDir} && npm install`);