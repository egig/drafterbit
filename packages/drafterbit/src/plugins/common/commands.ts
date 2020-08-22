import Application from "../../Application";
import commander from 'commander';


module.exports = function commands(cmd: commander.Command, app: Application) {
    cmd.command("install")
        .description("Install app data")
        .action(() => {
            app.get('log').info("Installing...");
            return app.install()
        });

    cmd.command('dev')
        .description("run dev mode")
        .action(() => {
            return app.start()
        });

    cmd.command('build')
        .description("build the application")
        .action(() => {
            return app.build()
        });
};