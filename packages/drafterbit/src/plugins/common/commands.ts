import Application from "../../Application";

module.exports = [
    {
        command: 'install',
        description: 'Install app data',
        createAction: (app: Application) => {
            return () => {
                console.log("installing...");
                return app.install()
            }
        }
    },
    {
        command: 'dev',
        description: 'run development mode',
        createAction: (app: Application) => {
            return () => {
                return app.start()
            }
        }
    },
];