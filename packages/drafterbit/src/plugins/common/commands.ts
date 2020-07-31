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
        description: 'Install app data',
        createAction: (app: Application) => {
            return () => {
                return app.start()
            }
        }
    },
];