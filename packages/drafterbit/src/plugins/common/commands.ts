import Application from "../../index";

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
    }
];