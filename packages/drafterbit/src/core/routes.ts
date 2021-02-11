import Application from "../Application";

const { Router } = require('../index');
const path = require('path');
let router = new Router();
const matter = require('gray-matter');
const fs = require('fs');

const DEFAULT_TEMPLATE = 'default.html';

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

function viewDataMiddleware() {
    return async (ctx: Application.Context, next: Application.Next) => {

        let baseURL = ctx.app.options.base_url ?  ctx.app.config.get('base_url')
            : `${ctx.protocol}://${ctx.host}`;
        ctx.state.data = {
            base_url: baseURL,
            theme_url: `${baseURL}/themes/${ctx.app.theme}`,
            app: {
                name: ctx.app.config.get('app_name'),
            },
        }

        return next()
    }
}

router.get("main", "/(.*)",
    viewDataMiddleware(),
    async (ctx: Application.Context, next: Application.Next) => {

    let contentFile: string = resolveContentFile(ctx);
    if (contentFile === "") {
        ctx.status = 404;
        return next();
    }

    const marked = ctx.app.get('marked');

    const file = matter.read(contentFile);
    let template = file.data.template || DEFAULT_TEMPLATE;

    let htmlContent = marked(file.content);

    let data = {
        ...ctx.state.data,
        page: {
            title: file.data.title,
            content: htmlContent
        }
    };

    ctx.body =  ctx.app.render(template, data);
    return next();

});

module.exports = router;