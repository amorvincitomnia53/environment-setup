'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
var VSCodeUI;
(function (VSCodeUI) {
    class CompileRunOutputChannel {
        constructor() {
            this.channel = vscode_1.window.createOutputChannel("C/C++ Compile Run");
        }
        appendLine(message, title) {
            if (title) {
                const simplifiedTime = (new Date()).toISOString().replace(/z|t/gi, " ").trim(); // YYYY-MM-DD HH:mm:ss.sss
                const hightlightingTitle = `[${title} ${simplifiedTime}]`;
                this.channel.appendLine(hightlightingTitle);
            }
            this.channel.appendLine(message);
        }
        append(message) {
            this.channel.append(message);
        }
        clear() {
            this.channel.clear();
        }
        show() {
            this.channel.show();
        }
    }
    VSCodeUI.CompileRunOutputChannel = CompileRunOutputChannel;
    class CompileRunTerminal {
        constructor() {
            this.terminals = {};
        }
        runInTerminal(command, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const defaultOptions = { addNewLine: true, name: "Compile Run" };
                const { addNewLine, name, cwd } = Object.assign(defaultOptions, options);
                if (this.terminals[name] === undefined) {
                    this.terminals[name] = vscode_1.window.createTerminal({ name });
                }
                this.terminals[name].show();
                if (cwd) {
                    this.terminals[name].sendText(getCDCommand(cwd), true);
                }
                this.terminals[name].sendText(getCommand(command), addNewLine);
            });
        }
        runExecutable(executable, args, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (process.platform === 'win32') {
                    this.runInTerminal(`"${executable}" ${args}`, options);
                }
                else {
                    this.runInTerminal(`./"${executable}" ${args}`, options);
                }
            });
        }
        closeAllTerminals() {
            Object.keys(this.terminals).forEach((id) => {
                this.terminals[id].dispose();
                delete this.terminals[id];
            });
        }
        onDidCloseTerminal(closedTerminal) {
            try {
                delete this.terminals[closedTerminal.name];
            }
            catch (error) {
                // ignore it.
            }
        }
    }
    VSCodeUI.CompileRunTerminal = CompileRunTerminal;
    VSCodeUI.compileRunTerminal = new CompileRunTerminal();
    function getCommand(cmd) {
        if (process.platform === "win32") {
            switch (currentWindowsShell()) {
                case 'PowerShell':
                    return `cmd /c ${cmd}`; // PowerShell
                default:
                    return cmd; // others, try using common one.
            }
        }
        else {
            return cmd;
        }
    }
    function getCDCommand(cwd) {
        if (process.platform === "win32") {
            switch (currentWindowsShell()) {
                case 'Git Bash':
                    return `cd "${cwd.replace(/\\+$/, "")}"`; // Git Bash: remove trailing '\'
                case 'PowerShell':
                    return `cd "${cwd}"`; // PowerShell
                case 'Command Prompt':
                    return `cd /d "${cwd}"`; // CMD
                case 'WSL Bash':
                    return `cd "${toWSLPath(cwd)}"`; // WSL
                default:
                    return `cd "${cwd}"`; // Unknown, try using common one.
            }
        }
        else {
            return `cd "${cwd}"`;
        }
    }
    function currentWindowsShell() {
        const is32ProcessOn64Windows = process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
        const system32Path = `${process.env.windir}\\${is32ProcessOn64Windows ? 'Sysnative' : 'System32'}`;
        const expectedLocations = {
            'Command Prompt': [`${system32Path}\\cmd.exe`],
            PowerShell: [`${system32Path}\\WindowsPowerShell\\v1.0\\powershell.exe`],
            'WSL Bash': [`${system32Path}\\bash.exe`],
            'Git Bash': [
                `${process.env.ProgramW6432}\\Git\\bin\\bash.exe`,
                `${process.env.ProgramW6432}\\Git\\usr\\bin\\bash.exe`,
                `${process.env.ProgramFiles}\\Git\\bin\\bash.exe`,
                `${process.env.ProgramFiles}\\Git\\usr\\bin\\bash.exe`,
                `${process.env.LocalAppData}\\Programs\\Git\\bin\\bash.exe`
            ]
        };
        const currentWindowsShellPath = vscode_1.workspace.getConfiguration("terminal").get("integrated.shell.windows");
        for (const key in expectedLocations) {
            if (expectedLocations[key].indexOf(currentWindowsShellPath) >= 0) {
                return key;
            }
        }
        return 'Others';
    }
    VSCodeUI.currentWindowsShell = currentWindowsShell;
    function toWSLPath(p) {
        const arr = p.split(":\\");
        if (arr.length === 2) {
            const drive = arr[0].toLowerCase();
            const dir = arr[1].replace(/\\/g, "/");
            return `/mnt/${drive}/${dir}`;
        }
        else {
            return ".";
        }
    }
    VSCodeUI.toWSLPath = toWSLPath;
})(VSCodeUI = exports.VSCodeUI || (exports.VSCodeUI = {}));
//# sourceMappingURL=VSCodeUI.js.map