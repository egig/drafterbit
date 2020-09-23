## Getting Started

### Server Requirements

Please make sure your server has following installed.

+ nodejs >= 12.18.3

### Installation

#### 1. Initiate New Project

```
mkdir my-app
cd my-app
npm init @drafterbit
```

Those command create new directory called `my-app` and then run `npm  init @drafterbit` inside that directory
which is install `drafterbit` and install it's dependencies.

#### 2. Start Development Server

Then we can start the development server
```
npm run dev
```

Now you can visit the site at `localhost:3000`

---

### Configuration

In Drafterbit, there is two type of configuration.

1. Environment config, you can set in OS Environment variable or in `.env` file in project root directory.
2. Project config, you can set in `drafterbit.config.js`.

You can start by copy `.env.example` to `.env` and edit according to your needs.

---

### Directory Structure

Drafterbit is file based application therefor it rely to its directory structure.
In fresh Drafterbit installation, you will get directories as follow.

| Directory | Description |
|-----------|-------------|
|**/content** | the content files.
|**/plugins** | where we put the plugins.
|**/public** | where we put public static file such as css or js.
|**/themes** | where we put the themes.
