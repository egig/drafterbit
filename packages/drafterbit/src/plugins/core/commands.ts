import Application from "../../Application";

module.exports = function commands(cmd: Application.Command, app: Application) {

    cmd.command('start')
        .description("run app")
        .option("-p, --production", "run app in production mode")
        .action((options) => {
            return app.start(options)
        });

    cmd.command('dev')
        .description("run dev mode")
        .action(() => {
            return app.start()
        });
};