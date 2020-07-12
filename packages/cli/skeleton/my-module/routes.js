const Router = require('@koa/router');
let router = new Router();

// Route Example
//
// router.get("/hello/:name", async (ctx, next) => {
//     ctx.body = `hello ${ctx.params.name} !`
// });

router.redirect("/", "/admin");

module.exports = router.routes();