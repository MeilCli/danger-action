import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as process from "process";
import * as path from "path";
import * as fs from "fs";

interface Option {
    readonly dangerVersion: string;
    readonly pluginsFile: string | null;
    readonly installPath: string | null;
    readonly dangerFile: string;
    readonly dangerId: string;
    readonly failOnStdErrWhenDanger: boolean;
}

const escapeGemfilePath = path.join(process.env.HOME as string, "danger-action", "Gemfile");
const escapeGemfileLockPath = path.join(process.env.HOME as string, "danger-action", "Gemfile.lock");

async function getOption(): Promise<Option> {
    let pluginsFile: string | null = core.getInput("plugins_file");
    if (pluginsFile.length == 0) {
        pluginsFile = null;
    }
    let installPath: string | null = core.getInput("install_path");
    if (installPath.length == 0) {
        installPath = null;
    }
    return {
        dangerVersion: core.getInput("danger_version", { required: true }),
        pluginsFile,
        installPath,
        dangerFile: core.getInput("danger_file", { required: true }),
        dangerId: core.getInput("danger_id", { required: true }),
        failOnStdErrWhenDanger: core.getInput("fail_on_stderr_when_danger") == "true",
    };
}

async function checkEnvironment() {
    await io.which("ruby", true);
    await io.which("bundle", true);
}

async function escapeGemfile(option: Option) {
    if (
        option.pluginsFile == null ||
        option.pluginsFile.toLowerCase() == "gemfile" ||
        option.pluginsFile.toLowerCase() == "gemfile.lock"
    ) {
        return;
    }
    if (fs.existsSync("Gemfile")) {
        io.mv("Gemfile", escapeGemfilePath);
    }
    if (fs.existsSync("Gemfile.lock")) {
        io.mv("Gemfile.lock", escapeGemfileLockPath);
    }
    io.cp(option.pluginsFile, "Gemfile");
}

async function installDanger(option: Option) {
    if (option.pluginsFile == null) {
        await exec.exec(`gem install danger --version "${option.dangerVersion}"`, undefined, { failOnStdErr: true });
    } else {
        if (option.installPath == null) {
            await exec.exec(`bundle install --jobs 4 --retry 3`, undefined, {
                failOnStdErr: true,
            });
        } else {
            await exec.exec(`bundle install --path=${option.installPath} --jobs 4 --retry 3`, undefined, {
                failOnStdErr: true,
            });
        }
    }
}

// ignore:  {RubyPath}/gems/2.6.0/gems/git-1.5.0/lib/git/lib.rb:1029: warning: Insecure world writable dir {RubyBinPath} in PATH, mode 040777
async function ignoreRubyWarning() {
    await core.exportVariable("RUBYOPT", "-W0");
}

async function runDanger(option: Option) {
    if (option.pluginsFile == null) {
        await exec.exec(`danger --dangerfile=${option.dangerFile} --danger_id=${option.dangerId}`, undefined, {
            failOnStdErr: option.failOnStdErrWhenDanger,
        });
    } else {
        await exec.exec(
            `bundle exec danger --dangerfile=${option.dangerFile} --danger_id=${option.dangerId}`,
            undefined,
            {
                failOnStdErr: option.failOnStdErrWhenDanger,
            }
        );
    }
}

async function unescapeGemfile() {
    if (fs.existsSync(escapeGemfilePath)) {
        io.mv(escapeGemfilePath, "Gemfile");
    }
    if (fs.existsSync(escapeGemfileLockPath)) {
        io.mv(escapeGemfileLockPath, "Gemfile.lock");
    }
}

async function run() {
    try {
        await checkEnvironment();
        const option = await getOption();
        await escapeGemfile(option);
        await installDanger(option);
        await ignoreRubyWarning();
        await runDanger(option);
        await unescapeGemfile();
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
