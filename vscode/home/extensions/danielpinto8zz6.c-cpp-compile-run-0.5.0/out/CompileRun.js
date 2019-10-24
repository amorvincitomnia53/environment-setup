"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const vscode_1 = require("vscode");
const CommandExists_1 = require("./CommandExists");
const Constants_1 = require("./Constants");
const File_1 = require("./File");
const Settings_1 = require("./Settings");
const VSCodeUI_1 = require("./VSCodeUI");
let processExists = require('process-exists');
class CompileRun {
    constructor() {
        this.outputChannel = new VSCodeUI_1.VSCodeUI.CompileRunOutputChannel();
        this.terminal = VSCodeUI_1.VSCodeUI.compileRunTerminal;
    }
    compile(file, inputFlags, callback = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Settings_1.Settings.saveBeforeCompile) {
                yield vscode_1.window.activeTextEditor.document.save();
            }
            if (yield processExists(file.$executable)) {
                vscode_1.window.showErrorMessage(`${file.$executable} is already runing! Please close it first to compile successfully!`);
                return;
            }
            let exec;
            let compilerArgs = [file.$name, '-o', file.$executable];
            let compilerSetting;
            let compilerSettingKey;
            switch (file.$extension) {
                case 'cpp': {
                    compilerSetting = {
                        path: Settings_1.Settings.cppCompiler(),
                        flags: Settings_1.Settings.cppFlags()
                    };
                    compilerSettingKey = {
                        path: Settings_1.Settings.key.cppCompiler,
                        flags: Settings_1.Settings.key.cppFlags
                    };
                    break;
                }
                case 'c': {
                    compilerSetting = {
                        path: Settings_1.Settings.cCompiler(),
                        flags: Settings_1.Settings.cFlags()
                    };
                    compilerSettingKey = {
                        path: Settings_1.Settings.key.cCompiler,
                        flags: Settings_1.Settings.key.cFlags
                    };
                    break;
                }
                default: {
                    return;
                }
            }
            if (!CommandExists_1.commandExists(compilerSetting.path)) {
                const CHANGE_PATH = "Change path";
                const choiceForDetails = yield vscode_1.window.showErrorMessage("Compiler not found, try to change path in settings!", CHANGE_PATH);
                if (choiceForDetails === CHANGE_PATH) {
                    let path = yield this.promptForPath();
                    yield vscode_1.workspace.getConfiguration("c-cpp-compile-run", null).update(compilerSettingKey.path, path, vscode_1.ConfigurationTarget.Global);
                    this.compile(file, inputFlags, callback);
                    return;
                }
                return;
            }
            let flags = compilerSetting.flags;
            if (inputFlags) {
                flags = yield this.promptForFlags(flags);
                if (flags === undefined) { // cancel.
                    return;
                }
            }
            if (flags) {
                compilerArgs = compilerArgs.concat(flags.split(" "));
            }
            exec = child_process_1.spawn(compilerSetting.path, compilerArgs, { cwd: file.$directory });
            exec.stdout.on('data', (data) => {
                this.outputChannel.appendLine(data, file.$name);
                this.outputChannel.show();
            });
            exec.stderr.on('data', (data) => {
                this.outputChannel.appendLine(data, file.$name);
                this.outputChannel.show();
            });
            exec.on('close', (data) => {
                if (data === 0) {
                    // Compiled successfully let's tell the user & execute
                    vscode_1.window.showInformationMessage("Compiled successfuly!");
                    if (callback !== null) {
                        callback(file);
                    }
                }
                else {
                    // Error compiling
                    vscode_1.window.showErrorMessage("Error compiling!");
                }
            });
        });
    }
    run(file, inputArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs_1.existsSync(file.$path)) {
                vscode_1.window.showErrorMessage(`"${file.$path}" doesn't exists!`);
                return;
            }
            let args = Settings_1.Settings.runArgs();
            if (inputArgs) {
                args = yield this.promptForRunArgs(args);
                if (args === undefined) { // cancel.
                    return;
                }
            }
            if (Settings_1.Settings.runInExternalTerminal()) {
                if (this.runExternal(file, args)) {
                    return;
                }
            }
            // Otherwise
            this.terminal.runExecutable(file.$executable, args, { cwd: file.$directory });
        });
    }
    compileRun(action) {
        return __awaiter(this, void 0, void 0, function* () {
            let doc = vscode_1.window.activeTextEditor.document;
            if (!doc) {
                return;
            }
            if (doc.isUntitled) {
                vscode_1.window.showErrorMessage(`Please save file first then try again!`);
                return;
            }
            let file = new File_1.File(vscode_1.window.activeTextEditor.document);
            switch (action) {
                case Constants_1.Constants.Action.Compile:
                    this.compile(file, false);
                    break;
                case Constants_1.Constants.Action.Run:
                    this.run(file, false);
                    break;
                case Constants_1.Constants.Action.CompileRun:
                    this.compile(file, false, (file) => this.run(file, false));
                    break;
                case Constants_1.Constants.Action.CustomCompile:
                    this.compile(file, true);
                    break;
                case Constants_1.Constants.Action.CustomRun:
                    this.run(file, true);
                    break;
                case Constants_1.Constants.Action.CustomCompileRun:
                    this.compile(file, true, (file) => this.run(file, true));
                    break;
                default: return;
            }
        });
    }
    promptForFlags(defaultFlags) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield vscode_1.window.showInputBox({
                    prompt: 'Flags',
                    placeHolder: '-Wall -Wextra',
                    value: defaultFlags
                });
            }
            catch (e) {
                return null;
            }
        });
    }
    promptForRunArgs(defaultArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield vscode_1.window.showInputBox({
                    prompt: 'Arguments',
                    value: defaultArgs
                });
            }
            catch (e) {
                return null;
            }
        });
    }
    promptForPath() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield vscode_1.window.showInputBox({
                    prompt: 'Path',
                    placeHolder: '/usr/bin/gcc'
                });
            }
            catch (e) {
                return null;
            }
        });
    }
    runExternal(file, args) {
        switch (process.platform) {
            case 'win32':
                child_process_1.exec(`start cmd /c ""${file.$executable}" ${args} & echo. & pause"`, { cwd: file.$directory });
                return true;
            case 'linux':
                let terminal = vscode_1.workspace.getConfiguration().get('terminal.external.linuxExec');
                if (!CommandExists_1.commandExists(terminal)) {
                    vscode_1.window.showErrorMessage(`${terminal} not found! Try to enter a valid terminal in 'terminal.external.linuxExec' settings! (gnome-terminal, xterm, konsole)`);
                    vscode_1.window.showInformationMessage('Running on vscode terminal');
                    return false;
                }
                switch (terminal) {
                    case 'xterm':
                        child_process_1.exec(`${terminal} -T ${file.$title} -e './"${file.$executable}" ${args}; echo; read -n1 -p "Press any key to continue..."'`, { cwd: file.$directory });
                        return true;
                    case 'gnome-terminal':
                    case 'tilix':
                    case 'mate-terminal':
                        child_process_1.exec(`${terminal} -t ${file.$title} -x bash -c './"${file.$executable}" ${args}; echo; read -n1 -p "Press any key to continue..."'`, { cwd: file.$directory });
                        return true;
                    case 'xfce4-terminal':
                        child_process_1.exec(`${terminal} --title ${file.$title} -x bash -c './"${file.$executable}" ${args}; read -n1 -p "Press any key to continue..."'`, { cwd: file.$directory });
                        return true;
                    case 'konsole':
                        child_process_1.exec(`${terminal} -p tabtitle='${file.$title}' --noclose -e bash -c './"${file.$executable}" ${args}'`, { cwd: file.$directory });
                        return true;
                    case 'io.elementary.terminal':
                        child_process_1.exec(`${terminal} -e './"${file.$executable}" ${args}'`, { cwd: file.$directory });
                        return true;
                    default:
                        vscode_1.window.showErrorMessage(`${terminal} isn't supported! Try to enter a supported terminal in 'terminal.external.linuxExec' settings! (gnome-terminal, xterm, konsole)`);
                        vscode_1.window.showInformationMessage('Running on vscode terminal');
                        return false;
                }
            case 'darwin':
                child_process_1.exec(`osascript - e 'tell application "Terminal" to do script "./"${file.$executable}" && read -n1 -p "Press any key to continue...""'`, { cwd: file.$directory });
                return true;
        }
        return false;
    }
}
exports.CompileRun = CompileRun;
//# sourceMappingURL=CompileRun.js.map