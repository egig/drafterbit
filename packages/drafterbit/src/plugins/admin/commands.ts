import Application from "../../Application";

module.exports = [
    {
        command: 'build',
        description: 'build the app',
        createAction: (app: Application) => {
            return () => {
                console.log('app building...');
                app.build();
            };
        }
    },
];