// FILE/FOLDER OPERATIONS

/**
 * Setup folder object or create if doesn't exist.
 */
function setupFolderObject(path: string): Folder {
    const folder = new Folder(path);
    if (!folder.exists) folder.create();
    return folder;
}

/**
 * Setup file object.
 */
function setupFileObject(path: Folder, name: string): File {
    return new File(`${path}/${name}`);
}

/**
 * Write string data to disk.
 */
function writeData(data: string, fp: string | File, mode: string = "w") {
    const f = new File(typeof fp === "string" ? fp : fp.fsName);
    try {
        f.encoding = "UTF-8";
        f.open(mode);
        f.write(data);
    } catch (e) {
        alert(localize(strings.fl_error_writing, f));
    } finally {
        f.close();
    }
}

/**
 * Read ExtendScript "json-like" data from file.
 */
function readJSONData(f: File): object {
    let json;
    try {
        f.encoding = "UTF-8";
        f.open("r");
        json = f.read();
    } catch (e) {
        alert(localize(strings.fl_error_loading, f));
    } finally {
        f.close();
    }
    return eval(json);
}

/**
 * Write ExtendScript "json-like" data to disk.
 */
function writeJSONData(obj: object, f: File) {
    const data = obj.toSource();
    try {
        f.encoding = "UTF-8";
        f.open("w");
        f.write(data);
    } catch (e) {
        alert(localize(strings.fl_error_writing, f));
    } finally {
        f.close();
    }
}
