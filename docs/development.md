# Development

To start development, please follow the instructions below:

#### 1. Fork the [repository](https://github.com/drafterbit/drafterbit)

[Go to the repository](https://github.com/drafterbit/drafterbit) and fork it to your own GitHub account.

#### 2. Clone from your repository

```bash
git clone git@github.com:YOUR_USERNAME/drafterbit.git
```

#### 3. Install the dependencies

Go to the root of the repository. Checkout develop branch. This is the main branch we use in development.
Then install the dependencies

```bash
cd drafterbit
git checkout develop
npm install
npm link
```

#### 4. Create Config File

Create `config .js` based on `config.js.example` and adjust the file content accordingly.

#### 5. Start Application

```bash
drafterbit start
```

Then you can visit the application in ```http://localhost:3000```

If anything happen unexpected or you have anything, question, suggestion, just please [create an issue](https://github.com/drafterbit/drafterbit/issues/new).
