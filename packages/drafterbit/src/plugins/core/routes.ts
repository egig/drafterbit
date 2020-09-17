import Application from "../../Application";

const Router = require('@koa/router');
const path = require('path');
let router = new Router();
const matter = require('gray-matter');
const fs = require('fs');

function resolveContentFile(ctx: any): string {
    let ctxPath = ctx.path;
    let contentRoot = path.join(ctx.app.projectDir, 'content');

    if (ctxPath === "/") {
        return path.join(contentRoot, 'index.md');
    }

    ctxPath = ctxPath.replace(/\/$/, "");
    let contentIndexDir = path.join(contentRoot, ctxPath, 'index.md');
    if (fs.existsSync(contentIndexDir)) {
        return contentIndexDir
    }

    let contentFilePath = path.join(contentRoot, `${ctxPath}.md`);
    if (fs.existsSync(contentFilePath)) {
        return contentFilePath;
    }

    return ""
}

router.get("/(.*)", async (ctx: Application.Context, next: Application.Next) => {

    let contentFile: string = resolveContentFile(ctx);

    const marked = ctx.app.get('marked');

    if (contentFile !== "") {
        const file = matter.read(contentFile);
        let template = 'default.html';
        if (file.data.layout) {
            template = file.data.layout
        }

        let htmlContent = marked(file.content);

        ctx.body =  ctx.app.render(template, { content: htmlContent });
        return next()
    }

    ctx.status = 404;
    return next();
});

module.exports = router.routes();