import path from "path"
import fs from "fs"
import ora from "ora"

function copy(srcDir: string, dstDir: string, spinner: ora.Ora | null) {

    let list = fs.readdirSync(srcDir);
    let src, dst;

    function skip(file: string) {
        return /.*node_modules.*|_site|\.env$/
            .test(file)
    }

    list.forEach(function(file) {
        src = path.join(srcDir,file);
        dst = path.join(dstDir,file);

        if (skip(file)) {
            return;
        }

        let stat = fs.statSync(src);
        if (stat && stat.isDirectory()) {
            if (!!spinner) {
                spinner.text = 'Creating Files: '+ dst;
            }
            fs.mkdirSync(dst);
            return copy(src, dst, spinner);
        }

        if (!!spinner) {
            spinner.text = 'Creating Files: '+ dst;
        }
        fs.writeFileSync(dst, fs.readFileSync(src));
    });
}

export default copy
