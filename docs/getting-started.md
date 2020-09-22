## Getting Started

### Table of Contents

* TOC
{:toc}

### Server Requirements

Please make sure your server has following installed.

+ nodejs >= 12.18.3

### Install Locally

#### 1. Initiate New Project

```
mkdir my-app
cd my-app
npm init @drafterbit
```

Those command create new directory called `my-app` and then run `npm  init @drafterbit` inside that directory
which is install `drafterbit` and install it's dependencies.

#### 2. Prepare Env Config

Still inside `my-app` directory, copy the `.env.example` to `.env` and edit it to suite our need.
```
cd .env.example .env
```

#### 3. Start Development Server

Then we can start the development server
```
npm run dev
```


Now you can visit the site at `localhost:3000` 