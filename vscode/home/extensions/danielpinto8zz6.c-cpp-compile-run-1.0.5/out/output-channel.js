"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
class OutputChannel {
    constructor() {
        this.channel = vscode.window.createOutputChannel('C/C++ Compile Run');
    }
    appendLine(message, title) {
        if (title) {
            const simplifiedTime = (new Date()).toISOString().replace(/z|t/gi, ' ').trim(); // YYYY-MM-DD HH:mm:ss.sss
            const hightlightingTitle = `[${title} ${simplifiedTime}]`;
            this.channel.appendLine(hightlightingTitle);
        }
        this.channel.appendLine(message);
    }
    append(message) {
        this.channel.append(message);
    }
    show() {
        this.channel.show();
    }
    dispose() {
        this.channel.dispose();
    }
    clear() {
        this.channel.clear();
    }
}
exports.outputChannel = new OutputChannel();
//# sourceMappingURL=output-channel.js.map