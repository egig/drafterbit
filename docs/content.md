---
title: Content
---

### Introduction

Content management is done by creating, editing or deleting markdown files in `content` directory.

One Markdown file for one web page.
Website url path is mapped to the markdown file or directory path. Table below illustrate
how we map url into file path.

|URL  |File Path|
| --- |-------- |
|/| content/index.md |
|/foo| content/foo.md or content/foo/index.md |
|/foo/bar| content/foo/bar.md or content/foo/bar/index.md

### Markdown

Markdown is another way to create html content.
Basically you create html but with another syntax.
For example, to create heading 1 title,
you do not use `<h1>`tag, but you use
this syntax instead
```
# your title
```
And let the software convert it to html. Markdown file usually saved
with extension `.md` or `.markdown`.
Drafterbit use `.md` to make it short.

If you new to this, you can refer to [the docs](https://daringfireball.net/projects/markdown/basics)
to get better grasp.

### Front Matter
You can add yaml configuration in top of you markdown file
wrapped with three dash, for example

```

---
title: you page title
---
```

That is known as "front matter". Its used to add configuration
specific to the page.

You can add front matter configuration as many as you like.
But these are front matter options recognized by the applicaiton.

|Name|Description|
|----|---|
|title| The title fo your page, used to create title in html head |
|layout| The layout file name used for the page. Must be supported by the theme |
