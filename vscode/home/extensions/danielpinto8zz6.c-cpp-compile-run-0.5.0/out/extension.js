'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const VSCodeUI_1 = require("./VSCodeUI");
const CompileRun_1 = require("./CompileRun");
const Constants_1 = require("./Constants");
const vscode_1 = require("vscode");
function activate(context) {
    const compileRun = new CompileRun_1.CompileRun();
    let register = (num) => {
        context.subscriptions.push(vscode_1.commands.registerCommand('extension.' + Constants_1.Constants.Action[num], () => {
            compileRun.compileRun(num);
        }));
    };
    register(Constants_1.Constants.Action.CompileRun);
    register(Constants_1.Constants.Action.CustomCompileRun);
    register(Constants_1.Constants.Action.Compile);
    register(Constants_1.Constants.Action.Run);
    register(Constants_1.Constants.Action.CustomCompile);
    register(Constants_1.Constants.Action.CustomRun);
    context.subscriptions.push(vscode_1.window.onDidCloseTerminal((closedTerminal) => {
        VSCodeUI_1.VSCodeUI.compileRunTerminal.onDidCloseTerminal(closedTerminal);
    }));
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map