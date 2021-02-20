import copy from "../src/copy";
import * as fs from 'fs-extra';
import * as path from "path";
import * as chai from 'chai';

describe("copy()", function () {
    it("copy source to dest", () => {
        let stub = path.join(__dirname, "../app")
        let dest = path.join(__dirname, "new_app")
        fs.removeSync(dest)
        fs.mkdirpSync(dest)
        copy(stub, dest, null)

        let fileList  = [
            'drafterbit.config.js',
            '.env.example',
            '.gitignore',
            'package.json',
            'README.md',
            'content/index.md',
            'content/typography.md',
            'content/another-page.md',
            'plugins/my-plugin/index.js',
            'plugins/my-plugin/routes.js',
            'public/.gitkeep',
            'themes/quill/public/css/index.css',
            'themes/quill/templates/default.html',
            'themes/quill/templates/page.html',
        ]

        fileList.forEach(f => {
            chai.assert(fs.existsSync(path.join(dest, f)), `should copied ${f}`)
        })

        fs.removeSync(dest)
    })
})