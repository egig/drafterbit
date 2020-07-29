#!/usr/bin/env node

const path = require('path');
const { https } = require('follow-redirects');
const fs = require('fs');
const unzip = require('unzip-stream');
const mkdirp = require('mkdirp');
const shell = require('shelljs');

const repoName = 'app';
const { version } = require('./package.json');
const srcDir = `${repoName}-${version}`;
let archiveUrl = `https://github.com/drafterbit/app/archive/${version}.zip`;
let destDir = process.cwd();

// Download
console.log("Downloading from", archiveUrl);
const download = function(url, cb) {
    https.get(url, res => {
        res.pipe(unzip.Parse())
            .on("finish", function () {
                cb();
            })
            .on('entry', function (entry) {
                let filePath = entry.path.replace(srcDir, "");
                if (filePath !== "") {

                    let fullPath = path.join(destDir, filePath);
                    console.log("creating file", fullPath);

                    let isDir = 'Directory' === entry.type;
                    let directory = isDir ? fullPath : path.dirname(fullPath);

                    mkdirp.sync(directory);
                    if (!isDir) {
                        entry.pipe(fs.createWriteStream(fullPath));
                    } else {
                        entry.autodrain();
                    }
                }
            })
    })
};


download(archiveUrl, function (e) {
    install()
});

function install() {
    shell.cd(process.cwd());
    setTimeout(() => {
        shell.exec('npm install');
    }, 1000);
}