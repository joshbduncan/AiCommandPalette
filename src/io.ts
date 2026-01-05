// FILE/FOLDER OPERATIONS

/**
 * Create a Folder object, creating the folder on disk if it doesn't exist.
 *
 * This is a convenience wrapper around ExtendScript's Folder constructor that
 * ensures the folder exists before returning the object.
 *
 * @param path - Absolute file system path to the folder.
 * @returns Folder object representing the path.
 */
function setupFolderObject(path: string): Folder {
    const folder = new Folder(path);
    if (!folder.exists) folder.create();
    return folder;
}

/**
 * Create a File object from a folder and filename.
 *
 * This is a convenience wrapper that constructs the full file path by combining
 * the folder path with the filename.
 *
 * @param path - Parent folder object.
 * @param name - Name of the file (including extension).
 * @returns File object representing the combined path.
 */
function setupFileObject(path: Folder, name: string): File {
    return new File(`${path}/${name}`);
}

/**
 * Read the entire contents of a text file as a UTF-8 string.
 *
 * The file is automatically opened, read, and closed. If an error occurs during
 * reading, the user is shown an alert and the error is logged.
 *
 * @param f - File object to read from.
 * @returns The file contents as a string, or undefined if reading fails.
 */
function readTextFile(f: File): string {
    let data;
    try {
        f.encoding = "UTF-8";
        f.open("r");
        data = f.read();
    } catch (e) {
        logger.log("Error reading file:", f.fsName, e.message);
        alert(localize(strings.fl_error_loading, f));
    } finally {
        f.close();
    }
    return data;
}

/**
 * Write string data to a text file with UTF-8 encoding.
 *
 * The file is automatically opened, written, and closed. If an error occurs during
 * writing, the user is shown an alert and the error is logged. The file will be
 * created if it doesn't exist.
 *
 * @param data - String data to write to the file.
 * @param fp - File path (as string) or File object to write to.
 * @param mode - File open mode: "w" for write (overwrite) or "a" for append. Defaults to "w".
 */
function writeTextFile(data: string, fp: string | File, mode: string = "w"): void {
    const f = new File(typeof fp === "string" ? fp : fp.fsName);
    try {
        f.encoding = "UTF-8";
        f.open(mode);
        f.write(data);
    } catch (e) {
        logger.log("Error writing file:", f.fsName, e.message);
        alert(localize(strings.fl_error_writing, f));
    } finally {
        f.close();
    }
}
