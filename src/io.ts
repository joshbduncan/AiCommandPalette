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
 * Read string data from disk.
 */
function readTextFile(f: File): string {
    let data;
    try {
        f.encoding = "UTF-8";
        f.open("r");
        data = f.read();
    } catch (e) {
        alert(localize(strings.fl_error_loading, f));
    } finally {
        f.close();
    }
    return data;
}

/**
 * Write string data to disk.
 */
function writeTextFile(data: string, fp: string | File, mode: string = "w") {
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
