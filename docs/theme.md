---
title: Theme
---

### Introduction

We use **theme**  to represent your content as web page so you can
add styles to the web page according to you needs.
Currently only one default theme available which named
"quill". However, you can create your own theme.

A theme is consist of
1. A directory named of your choice
2. A template file
3. A public directory to server your theme-related static file

####  Directory Structure
This is simplest directory structure required to create a theme.
```sh
/<theme-name>/
   /public
   /templates/
        /default.html
```

### Create you own

The easiest way to create your own theme is
by copy the default theme directory to new name of your choice
then modify layout and stylesheet to fit your needs.

Then edit the `theme` config in file `drafterbit.config.js`

#### Default Template

One required file to create a theme is the default template file
located in

```<theme-dir>/templates/default.html```

Drafterbit use [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) as template engine.
Here is variable exposed  you can use in your template.

|Name|Description|
|----|---|
|app.name | The website or applicaiton name|
|base_url| The base url of the site |
|theme_url| The url to the public theme directory |
|page.title| Title of the page |
|page.content| The main content rendered as html |
