/**
 * Determine the base calling script from the current stack.
 * @returns {String} Initial script name.
 */
function resolveBaseScriptFromStack() {
    var stack = $.stack.split("\n");
    var foo, bar;
    for (var i = 0; i < stack.length; i++) {
        foo = stack[i];
        if (foo[0] == "[" && foo[foo.length - 1] == "]") {
            bar = foo.slice(1, foo.length - 1);
            if (isNaN(bar)) {
                break;
            }
        }
    }
    return bar;
}

class Logger {
    private file: File;
    private mode: string;
    private consoleOutput: boolean;
    private badPath: boolean = false;

    /**
     * Class for easy file logging from within Adobe ExtendScript.
     * @param fp File path for the log file. Defaults to `Folder.userData/{base_script_file_name}.log`.
     * @param mode Optional log file write mode. Write `w` mode or append `a` mode. If write mode 'w', the log file will be overwritten on each script run. Defaults to `w`.
     * @param sizeLimit Log file size limit (in bytes) for rotation. Defaults to 5,000,000.
     * @param consoleOutput Forward calls to `Logger.log()` to the JavaScript Console via `$.writeln()`. Defaults to `false`.
     */
    constructor(
        fp?: string,
        mode: string = "w",
        sizeLimit: number = 5000000,
        consoleOutput: boolean = false
    ) {
        if (typeof fp === "undefined") {
            fp = Folder.userData.fullName + "/" + resolveBaseScriptFromStack() + ".log";
        }

        this.mode = mode.toLowerCase();
        this.consoleOutput = consoleOutput;
        this.file = new File(fp);

        // Rotate log if too big
        if (this.file.length > sizeLimit) {
            this.backup(true);
        }
    }

    /**
     * Backup the log file.
     */
    backup(removeOriginal: boolean = false): File {
        const ts = Date.now();
        const backupFile = new File(`${this.file.fsName}.${ts}.bak`);
        this.file.copy(backupFile.fsName);
        if (removeOriginal) this.file.remove();
        return backupFile;
    }

    /**
     * Write data to the log file.
     */
    log(...text: string[]): boolean {
        if (this.badPath) return false;

        const f = this.file;
        const ts = new Date().toLocaleString();

        // Ensure parent folder exists
        if (!f.parent.exists) {
            if (!f.parent.parent.exists) {
                alert("Bad log file path!\n'" + f.fullName + "'");
                this.badPath = true;
                return false;
            }
            f.parent.create();
        }

        const args = [`[${ts}]`].concat(text);

        try {
            f.encoding = "UTF-8";
            f.open(this.mode);
            f.writeln(args.join(" "));
        } catch (e) {
            $.writeln(`Error writing file: ${f.fullName}`);
            return false;
        } finally {
            f.close();
        }

        if (this.consoleOutput) {
            $.writeln(text.join(" "));
        }

        return true;
    }

    /**
     * Open the log file.
     */
    open(): void {
        this.file.execute();
    }

    /**
     * Reveal the log file location.
     */
    reveal(): void {
        this.file.parent.execute();
    }
}
