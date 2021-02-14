import execa  from "execa";
import ora from "ora";

function install(spinner: ora.Ora, wd: string) {
    let proc = execa('npm', ['install', '--only=prod', '--no-fund', '-d'], {
        cwd: wd
    });

    if (!!proc.stdout) {
        proc.stdout.on('data', (chunk) => {
            spinner.text = chunk;
        });
    }

    return proc;
}

export default install