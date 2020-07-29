# Getting Started

## Initiate New Project

```
mkdir my-app
cd my-app
npm init @drafterbit
```

Those command create new directory called `my-app` and then run `npm  init @drafterbit` inside that directory.

## Prepare Env Config

Still inside `my-app` directory, copy the `.env.example` to `.env` and edit it to suite our need.
```
cd .env.example .env
```

## Install

Now You can install the application by running following command.
```
node bin/cli.js install
```

## Start Development Server

Then we can start the development server
```
npm start
```