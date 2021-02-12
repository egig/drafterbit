import Application from "../Application";

module.exports = function commands(cmd: Application.Command, app: Application) {

    cmd.command('start')
        .description("Run the app")
        .action((options) => {
            return app.start(options)
        });

    cmd.command('dev')
        .description("Run the app in dev mode")
        .action(() => {
            return app.start({watch: true})
        });
};