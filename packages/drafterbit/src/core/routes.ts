import Application from "../Application";

const { Router } = require('../index');
const path = require('path');
let router = new Router();
const matter = require('gray-matter');
const fs = require('fs');

function resolveContentFile(ctx: any): string {
    let ctxPath = ctx.path;
    let contentRoot = path.join(ctx.app.dir, 'content');


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

router.get("main", "/(.*)",
    async (ctx: Application.Context, next: Application.Next) => {

    let contentFile: string = resolveContentFile(ctx);
    if (contentFile === "") {
        ctx.status = 404;
        return next();
    }

    const marked = ctx.app.get('marked');

    const file = matter.read(contentFile);
    let template = file.data.template || ctx.app.config.get("defaultTemplate");

    let htmlContent = marked(file.content);

    let baseURL = ctx.app.options.base_url ?  ctx.app.config.get('base_url')
            : `${ctx.protocol}://${ctx.host}`;
    let data = {
        ...ctx.app.baseViewData(),
        base_url: baseURL,
        page: {
            title: file.data.title,
            content: htmlContent
        }
    };

    ctx.body =  ctx.app.render(template, data);
    return next();

});

module.exports = router;