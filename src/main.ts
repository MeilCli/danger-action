import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";

interface Option {
    readonly dangerVersion: string;
    readonly pluginsFile: string | null;
    readonly dangerFile: string;
    readonly dangerId: string;
}

async function getOption(): Promise<Option> {
    let pluginsFile: string | null = core.getInput("plugins_file");
    if (pluginsFile.length == 0) {
        pluginsFile = null;
    }
    return {
        dangerVersion: core.getInput("danger_version", { required: true }),
        pluginsFile,
        dangerFile: core.getInput("danger_file", { required: true }),
        dangerId: core.getInput("danger_id", { required: true })
    };
}

async function checkEnvironment() {
    await io.which("ruby", true);
    await io.which("bundle", true);
}

async function installDanger(option: Option) {
    await exec.exec(`gem install danger --version "${option.dangerVersion}"`, undefined, { failOnStdErr: true });
    if (option.pluginsFile != null) {
        await exec.exec(`bundle install --gemfile=${option.pluginsFile}`, undefined, { failOnStdErr: true });
    }
}

// ignore:  {RubyPath}/gems/2.6.0/gems/git-1.5.0/lib/git/lib.rb:1029: warning: Insecure world writable dir {RubyBinPath} in PATH, mode 040777
async function ignoreRubyWarning() {
    await core.exportVariable("RUBYOPT", "-W0");
}

async function runDanger(option: Option) {
    await exec.exec(`danger --dangerfile=${option.dangerFile} --danger_id=${option.dangerId}`, undefined, {
        failOnStdErr: true
    });
}

async function run() {
    try {
        await checkEnvironment();
        const option = await getOption();
        await installDanger(option);
        await ignoreRubyWarning();
        await runDanger(option);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
