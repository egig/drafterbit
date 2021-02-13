const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');
const fs = require('fs-extra');

module.exports = function commands(cmd, app) {
    cmd.command('static:generate')
        .description('Generate static site')
        .action(() => {
            let contentRoot = path.join(app.dir, '/content');
            let staticSiteRoot = path.join(app.dir, '/_site');

            glob('**/*.md', {
                cwd: contentRoot,
            }, function (er, files) {
                files.forEach(function (f) {
                    let fPathAbs = path.join(contentRoot, f);
                    const marked = app.get('marked');

                    const file = matter.read(fPathAbs);
                    let template = file.data.template || app.DEFAULT_TEMPLATE;

                    let htmlContent = marked(file.content);

                    let data = {
                        base_url: '',
                        theme_url: '',
                        app: {
                            name: app.config.get('app_name'),
                        },
                        page: {
                            title: file.data.title,
                            content: htmlContent
                        }
                    };

                    let fileContent = app.render(template, data);
                    fs.mkdirpSync(staticSiteRoot);
                    let htmlFile = f.replace('.md', '.html');
                    let htmlFilePath = path.join(staticSiteRoot, htmlFile);
                    console.log(htmlFilePath);
                    fs.outputFileSync(htmlFilePath, fileContent);
                });

                let themePublicRoot = path.join(app.dir, 'themes', app.theme, 'public');
                fs.copySync(themePublicRoot, staticSiteRoot);
            });
        });
};