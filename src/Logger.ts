/**
 * Extracts the base calling script identifier from an Adobe ExtendScript stack trace.
 *
 * ExtendScript exposes the current stack as `$.stack`, where entries may include lines
 * like `[SomeScript.jsx]` or `[123]`. This function returns the first bracketed entry
 * that is *not* purely numeric (i.e., likely a script name/path).
 *
 * This implementation is ES3-safe when compiled (no `Number.isFinite`, no ES2015 APIs).
 *
 * @param stack Optional stack trace text to parse. Defaults to `$.stack` when available.
 * @returns The first non-numeric bracketed entry (e.g. `"MyScript.jsx"`), or `undefined` if none found.
 */
function resolveBaseScriptFromStack(stack?: string): string | undefined {
    const raw =
        stack ??
        (typeof $ !== "undefined" && ($ as any).stack ? String(($ as any).stack) : "");

    if (!raw) return undefined;

    const lines = raw.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line || line.charAt(0) !== "[" || line.charAt(line.length - 1) !== "]") {
            continue;
        }

        const inner = line.slice(1, line.length - 1).replace(/^\s+|\s+$/g, "");
        if (!inner) continue;

        // ES3-safe numeric check
        // `isNaN()` coerces; numeric strings => false, non-numeric => true
        if (isNaN(inner as any)) {
            return inner;
        }
    }

    return undefined;
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
            $.writeln(`Error writing log file: ${f.fullName} - ${e.message}`);
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
