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
const vscode = __importStar(require("vscode"));
const output_channel_1 = require("./output-channel");
const cp_utils_1 = require("./utils/cp-utils");
var WindowsShellType;
(function (WindowsShellType) {
    WindowsShellType["CMD"] = "Command Prompt";
    WindowsShellType["POWER_SHELL"] = "PowerShell";
    WindowsShellType["GIT_BASH"] = "Git Bash";
    WindowsShellType["WSL"] = "WSL Bash";
    WindowsShellType["OHTERS"] = "Others";
})(WindowsShellType || (WindowsShellType = {}));
class Terminal {
    constructor() {
        this.terminals = {};
    }
    run(command, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultOptions = { addNewLine: true, name: 'C/C++ Compile Run' };
            const { addNewLine, name, cwd } = Object.assign(defaultOptions, options);
            if (this.terminals[name] === undefined) {
                this.terminals[name] = vscode.window.createTerminal({ name });
            }
            this.terminals[name].show();
            if (cwd) {
                this.terminals[name].sendText(yield getCDCommand(cwd), true);
            }
            this.terminals[name].sendText(getCommand(command), addNewLine);
            return this.terminals[name];
        });
    }
    closeAllTerminals() {
        Object.keys(this.terminals).forEach((id) => {
            this.terminals[id].dispose();
            delete this.terminals[id];
        });
    }
    onClose(closedTerminal) {
        try {
            delete this.terminals[closedTerminal.name];
        }
        catch (error) {
            // ignore it.
        }
    }
    // To Refactor: remove from here.
    formattedPathForTerminal(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.platform === 'win32') {
                switch (currentWindowsShell()) {
                    case WindowsShellType.WSL:
                        return yield toWslPath(filepath);
                    default:
                        return filepath;
                }
            }
            else {
                return filepath;
            }
        });
    }
    dispose(id) {
        if (id) {
            this.terminals[id].dispose();
        }
        else {
            this.closeAllTerminals();
        }
    }
}
function getCommand(cmd) {
    if (process.platform === 'win32') {
        switch (currentWindowsShell()) {
            case WindowsShellType.POWER_SHELL:
                return `cmd /c ${cmd}`; // PowerShell
            default:
                return cmd; // others, try using common one.
        }
    }
    else {
        return `./${cmd}`;
    }
}
function getCDCommand(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.platform === 'win32') {
            switch (currentWindowsShell()) {
                case WindowsShellType.GIT_BASH:
                    return `cd "${cwd.replace(/\\+$/, '')}"`; // Git Bash: remove trailing '\'
                case WindowsShellType.POWER_SHELL:
                    // Escape '[' and ']' in PowerShell
                    // See: https://github.com/microsoft/vscode-maven/issues/324
                    const escaped = cwd.replace(/([\[\]])/g, '``$1');
                    return `cd "${escaped}"`; // PowerShell
                case WindowsShellType.CMD:
                    return `cd /d "${cwd}"`; // CMD
                case WindowsShellType.WSL:
                    return `cd "${yield toWslPath(cwd)}"`; // WSL
                default:
                    return `cd "${cwd}"`; // Unknown, try using common one.
            }
        }
        else {
            return `cd "${cwd}"`;
        }
    });
}
function currentWindowsShell() {
    const currentWindowsShellPath = vscode.env.shell;
    if (currentWindowsShellPath.endsWith('cmd.exe')) {
        return WindowsShellType.CMD;
    }
    else if (currentWindowsShellPath.endsWith('powershell.exe')) {
        return WindowsShellType.POWER_SHELL;
    }
    else if (currentWindowsShellPath.endsWith('bash.exe') || currentWindowsShellPath.endsWith('wsl.exe')) {
        if (currentWindowsShellPath.includes('Git')) {
            return WindowsShellType.GIT_BASH;
        }
        return WindowsShellType.WSL;
    }
    else {
        return WindowsShellType.OHTERS;
    }
}
function toDefaultWslPath(p) {
    const arr = p.split(':\\');
    if (arr.length === 2) {
        const drive = arr[0].toLowerCase();
        const dir = arr[1].replace(/\\/g, '/');
        return `/mnt/${drive}/${dir}`;
    }
    else {
        return p.replace(/\\/g, '/');
    }
}
function toWslPath(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return (yield cp_utils_1.executeCommand('wsl', ['wslpath', '-u', `"${path.replace(/\\/g, '/')}"`])).trim();
        }
        catch (error) {
            output_channel_1.outputChannel.appendLine(error, 'WSL');
            return toDefaultWslPath(path);
        }
    });
}
exports.toWslPath = toWslPath;
function toWinPath(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield cp_utils_1.executeCommand('wsl', ['wslpath', '-w', `"${path}"`])).trim();
    });
}
exports.toWinPath = toWinPath;
exports.terminal = new Terminal();
//# sourceMappingURL=terminal.js.map