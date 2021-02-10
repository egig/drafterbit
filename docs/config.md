---
title: Config
---

There is two type of configuration.

1. Environment config, you can set in OS Environment variable or in `.env` file in project root directory.
2. Project config, you can set in `drafterbit.config.js`.

### Environment Variable

Following are the environment variable used by drafterbit

|Name|Description|Default|
|----|------|------|
| DRAFTERBIT_PORT | Port which the applicatoin should run | 3000 |
| DRAFTERBIT_APP_NAME | The name of the application / website | |
| DRAFTERBIT_DEBUG | whether to output debug information while running the server | false |
| DRAFTERBIT_ENV | Environment used by the application | production |


### Project Config

This config defined in file named `drafterbit.config.js` in project directory and
you might want to include it in vcs as this config defines the features of the application.


|Name|Description|Default|
|----|------|------|
| appName | The name of your application, the environment variable DRAFTERBIT_APP_NAME take higher priority |  |
| theme | The theme name used | quill |
| plugins | The list of plugins | [] |