---
title: Plugin
---

### Introduction

Drafterbit supports plugins to extend its functionality.
By creating plugins, you can add functionality
according to your needs, you can add routes,
middlewares, configuration options even add library
such as database connection or email service.

Plugins lives in `plugins` directory. You place
your plugin in it and list your plugin in
`drafterbit.config.js` to activate your plugin.


### Directory Structure

```
<plugin-name>/
    /index.js
    /routes.js
    /config.js
```

|Name|Description|
|----|-----------|
|index.js| Main file of your plugin, you define plugin in this file
|routes.js| Where you define the routes for the application
|config.js| Where you define configuration options for your plugin 

### Create Plugin

#### Main File
The main file for the plugin is the `index.js` file.
You need to create your plugin in that file.

This is simplest plugin named `my-plugin` that does nothing.

```js
const { Plugin } = require('drafterbit');

class MyPlugin extends Plugin {
}

module.exports = MyPlugin;
```

You can save it in `plugins/my-plugin/index.js`

#### Routes

Routes defined in `plugins/my-plugin/routes.js` and you can
create the routes exactly same with how you create route fro Koa framework
execpt you import Router from `drafterbit`, you create router, and
you must export the router. Here is the example.

```js
const { Router } = require('drafterbit');
let router = new Router();
router.get("/hello", async (ctx, next) => {
    ctx.body = "hello"
});

module.exports = router;
```
