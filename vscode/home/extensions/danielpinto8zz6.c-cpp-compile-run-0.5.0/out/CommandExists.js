'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
function fileNotExistsSync(command) {
    try {
        fs_1.accessSync(command, fs_1.constants.F_OK);
        return false;
    }
    catch (e) {
        return true;
    }
}
exports.fileNotExistsSync = fileNotExistsSync;
function localExecutableSync(command) {
    try {
        fs_1.accessSync(command, fs_1.constants.F_OK | fs_1.constants.X_OK);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.localExecutableSync = localExecutableSync;
function commandExistsUnixSync(command) {
    if (fileNotExistsSync(command)) {
        try {
            var stdout = child_process_1.execSync('command -v ' + command +
                ' 2>/dev/null' +
                ' && { echo >&1 ' + command + '; exit 0; }');
            return !!stdout;
        }
        catch (error) {
            return false;
        }
    }
    return localExecutableSync(command);
}
exports.commandExistsUnixSync = commandExistsUnixSync;
function commandExistsWindowsSync(command) {
    if (fileNotExistsSync(command)) {
        try {
            var stdout = child_process_1.execSync('where ' + command, { stdio: [] });
            return !!stdout;
        }
        catch (error) {
            return false;
        }
    }
    return localExecutableSync(command);
}
exports.commandExistsWindowsSync = commandExistsWindowsSync;
function commandExists(command) {
    if (process.platform === 'win32') {
        return commandExistsWindowsSync(command);
    }
    else {
        return commandExistsUnixSync(command);
    }
}
exports.commandExists = commandExists;
//# sourceMappingURL=CommandExists.js.map