module.exports = [
    {
        command: 'start',
        description: 'start server',
        createAction: app => {
            return () => {
                app.start();
            };
        }
    },
    {
        command: 'build',
        description: 'build the app',
        createAction: app => {
            return () => {
                console.log('app building...');
                app.build();
            };
        }
    },
];