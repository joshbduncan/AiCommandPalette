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

/**
 * Module for easy file logging from within Adobe ExtendScript.
 * @param {String} fp File path for the log file. Defaults to `Folder.userData/{base_script_file_name}.log`.
 * @param {String} mode Optional log file write mode. Write `w` mode or append `a` mode. If write mode 'w', the log file will be overwritten on each script run. Defaults to `w`.
 * @param {Number} sizeLimit Log file size limit (in bytes) for rotation. Defaults to 5,000,000.
 * @param {Boolean} console Forward calls to `Logger.log()` to the JavaScript Console via `$.writeln()`. Defaults to `false`.
 */
function Logger(fp, mode, sizeLimit, console) {
  if (typeof fp == "undefined")
    fp = Folder.userData + "/" + resolveBaseScriptFromStack() + ".log";

  this.mode = typeof mode !== "undefined" ? mode.toLowerCase() : "w";
  this.console = typeof console !== "undefined" ? console : false;
  this.file = new File(fp);
  this.badPath = false;

  // rotate log if too big
  sizeLimit = typeof sizeLimit !== "undefined" ? Number(sizeLimit) : 5000000;
  if (this.file.length > sizeLimit) {
    var ts = Date.now();
    var rotatedFile = new File(this.file + ts + ".bak");
    this.file.copy(rotatedFile);
    this.file.remove();
    alert(this.file);
  }
}

Logger.prototype = {
  /**
   * Backup the log file.
   * @returns {FileObject} Backup file object.
   */
  backup: function () {
    var backupFile = new File(this.file + ".bak");
    this.file.copy(backupFile);
    return backupFile;
  },
  /**
   * Write data to the log file.
   * @param {String} text One or more strings to write, which are concatenated to form a single string.
   * @returns {Boolean} Returns true if log file is successfully written, false if unsuccessful.
   */
  log: function (text) {
    // no need to keep alerting when the log path is bad
    if (this.badPath) return false;

    var f = this.file;
    var m = this.mode;
    var ts = new Date().toLocaleString();

    // ensure parent folder exists
    if (!f.parent.exists) {
      if (!f.parent.parent.exists) {
        alert("Bad log file path!\n'" + this.file + "'");
        this.badPath = true;
        return false;
      }
      f.parent.create();
    }

    // grab all arguments
    var args = ["[" + ts + "]"];
    for (var i = 0; i < arguments.length; ++i) args.push(arguments[i]);

    // write the data
    try {
      f.encoding = "UTF-8";
      f.open(m);
      f.writeln(args.join(" "));
    } catch (e) {
      $.writeln("Error writing file:\n" + f);
      return false;
    } finally {
      f.close();
    }

    // write `text` to the console if requested
    if (this.console) $.writeln(args.slice(1, args.length).join(" "));

    return true;
  },
  /**
   * Open the log file.
   */
  open: function () {
    this.file.execute();
  },
  /**
   * Reveal the log file in the platform-specific file browser.
   */
  reveal: function () {
    this.file.parent.execute();
  },
};
