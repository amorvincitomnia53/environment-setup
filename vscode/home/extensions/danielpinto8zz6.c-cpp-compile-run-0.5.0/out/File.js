"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
class File {
    constructor(file) {
        this.path = file.fileName;
        this.name = path_1.basename(this.path);
        this.title = path_1.basename(this.path, path_1.extname(this.path));
        this.directory = path_1.dirname(this.path);
        this.extension = file.languageId;
        if (process.platform === 'win32') {
            this.executable = `${this.title}.exe`;
        }
        else {
            this.executable = `${this.title}`;
        }
    }
    /**
     * Getter $path
     * @return {string}
     */
    get $path() {
        return this.path;
    }
    /**
     * Getter $name
     * @return {string}
     */
    get $name() {
        return this.name;
    }
    /**
     * Getter $directory
     * @return {string}
     */
    get $directory() {
        return this.directory;
    }
    /**
     * Getter $extension
     * @return {string}
     */
    get $extension() {
        return this.extension;
    }
    /**
     * Getter $executable
     * @return {string}
     */
    get $executable() {
        return this.executable;
    }
    /**
     * Getter $title
     * @return {string}
     */
    get $title() {
        return this.title;
    }
}
exports.File = File;
//# sourceMappingURL=File.js.map