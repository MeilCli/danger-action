import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';

interface Option {
    readonly dangerVersion: string;
    readonly pluginsFile: string | null;
    readonly dangerFile: string;
    readonly dangerId: string;
}

async function getOption(): Promise<Option> {
    return {
        dangerVersion: core.getInput("danger_version", { required: true }),
        pluginsFile: core.getInput("plugins_file"),
        dangerFile: core.getInput("danger_file", { required: true }),
        dangerId: core.getInput("danger_id", { required: true })
    };
}

async function checkEnvironment() {
    await io.which("ruby", true);
    await io.which("bundle", true);
}

async function installDanger(option: Option) {
    await exec.exec(
        `gem install danger --version "${option.dangerVersion}"`,
        undefined,
        { failOnStdErr: true }
    );
    if (option.pluginsFile != null) {
        await exec.exec(
            `bundle install --gemfile=${option.pluginsFile}`,
            undefined,
            { failOnStdErr: true }
        );
    }
}

async function runDanger(option: Option) {
    await exec.exec(
        `danger --dangerfile=${option.dangerFile} --danger_id=${option.dangerId} --silent=true`,
        undefined,
        { failOnStdErr: true }
    );
}

async function run() {
    try {
        await checkEnvironment();
        const option = await getOption();
        await installDanger(option);
        await runDanger(option);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
