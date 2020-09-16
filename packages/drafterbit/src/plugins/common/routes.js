const Router = require('@koa/router');
const path = require('path');
let router = new Router();
const matter = require('gray-matter');
const fs = require('fs');

// Route Example
//
router.get("/(.*)", async (ctx, next) => {



    let ctxPath = ctx.path;
    let contentRoot;
    if (ctxPath === "/") {
        contentRoot = path.join(ctx.app.projectDir, 'content/index.md');
    } else {

        ctxPath = ctxPath.replace(/\/$/, "");

        let contentDir = path.join(ctx.app.projectDir, `content${ctxPath}/index.md`);
        if (fs.existsSync(contentDir)) {
            contentRoot = contentDir
        }

        let contentFile = path.join(ctx.app.projectDir, `content${ctxPath}.md`);
        if (fs.existsSync(contentFile)) {
            contentRoot = contentFile
        }
    }

    const file = matter.read(contentRoot);
    let htmlContent = marked(file.content);

    ctx.body =  ctx.app.render('layout.html', { content: htmlContent });
});

module.exports = router.routes();