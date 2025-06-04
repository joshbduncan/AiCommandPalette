// FILE/FOLDER OPERATIONS

/**
 * Setup folder object or create if doesn't exist.
 * @param   {String} path System folder path.
 * @returns {Object}      Folder object.
 */
function setupFolderObject(path) {
  var folder = new Folder(path);
  if (!folder.exists) folder.create();
  return folder;
}

/**
 * Setup file object.
 * @param   {Object} path Folder object where file should exist,
 * @param   {String} name File name.
 * @returns {Object}      File object.
 */
function setupFileObject(path, name) {
  return new File(path + "/" + name);
}

/**
 * Write string data to disk.
 * @param {String} data Data to be written.
 * @param {Object} fp   File path.
 * @param {string} mode File access mode.
 */
function writeData(data, fp, mode) {
  mode = typeof mode !== "undefined" ? mode : "w";
  f = new File(fp);
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
 * @param   {Object} f File object to read.
 * @returns {Object}   Evaluated JSON data.
 */
function readJSONData(f) {
  var json, obj;
  try {
    f.encoding = "UTF-8";
    f.open("r");
    json = f.read();
  } catch (e) {
    alert(localize(strings.fl_error_loading, f));
  } finally {
    f.close();
  }
  obj = eval(json);
  return obj;
}

/**
 * Write ExtendScript "json-like" data to disk.
 * @param {Object} obj Data to be written.
 * @param {Object} f   File object to write to.
 */
function writeJSONData(obj, f) {
  var data = obj.toSource();
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
