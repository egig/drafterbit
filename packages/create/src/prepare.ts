import path from 'path'
import fs, {mkdirpSync} from 'fs-extra'
import ora from 'ora'

function prepare(spinner: ora.Ora | null, cwd: string, installDir: string | undefined): string {
    let destDir = cwd

    if (installDir !== undefined) {
        destDir = path.join(cwd, installDir);
    }

    try {

        fs.statSync(destDir);
        let files =  fs.readdirSync(destDir);
        if (files.length >= 1) {
            throw new Error(`Directory ${destDir} is not empty !`);
        }

    } catch (err) {
        if (err.code === 'ENOENT') {
            if (!!spinner) {
                spinner.text = 'Create app dir: ' + destDir;
            }
            mkdirpSync(destDir)
            return destDir
        }

        throw err
    }

    return destDir
}

export default prepare