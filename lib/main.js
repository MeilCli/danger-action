"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const io = __importStar(require("@actions/io"));
function getOption() {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            dangerVersion: core.getInput("danger_version", { required: true }),
            pluginsFile: core.getInput("plugins_file"),
            dangerFile: core.getInput("danger_file", { required: true }),
            dangerId: core.getInput("danger_id", { required: true })
        };
    });
}
function checkEnvironment() {
    return __awaiter(this, void 0, void 0, function* () {
        yield io.which("ruby", true);
        yield io.which("bundle", true);
    });
}
function installDanger(option) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec.exec(`gem install danger --version "${option.dangerVersion}"`, undefined, { failOnStdErr: true });
        if (option.pluginsFile != null) {
            yield exec.exec(`bundle install --gemfile=${option.pluginsFile}`, undefined, { failOnStdErr: true });
        }
    });
}
// ignore:  {RubyPath}/gems/2.6.0/gems/git-1.5.0/lib/git/lib.rb:1029: warning: Insecure world writable dir {RubyBinPath} in PATH, mode 040777
function ignoreRubyWarning() {
    return __awaiter(this, void 0, void 0, function* () {
        yield core.exportVariable("RUBYOPT", "-W0");
    });
}
function runDanger(option) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec.exec(`danger --dangerfile=${option.dangerFile} --danger_id=${option.dangerId} --silent=true`, undefined, { failOnStdErr: true });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield checkEnvironment();
            const option = yield getOption();
            yield installDanger(option);
            yield ignoreRubyWarning();
            yield runDanger(option);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
