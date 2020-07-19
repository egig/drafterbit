module.exports = [
    {
        command: 'install',
        description: 'Install app data',
        createAction: app => {
            return () => {
                console.log("installing...");
                return app.install()
            }
        }
    }
];