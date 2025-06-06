/**
 * Attempts to resolve the correct localized string for a given property
 * on a command object. If the property is a language map, it is passed
 * directly to `localize()`. If the property is a string that matches a key
 * in the global `strings` map, the corresponding localized string is returned.
 * Otherwise, the original string is returned as-is.
 *
 * @param command - The command object containing the property to resolve.
 * @param prop - The property name to check and localize.
 * @returns The resolved string, either localized or raw.
 */
function determineCorrectString(command: CommandEntry, prop: string): string {
  const value = command[prop];

  if (typeof value === "object") {
    return localize(value);
  }

  if (strings.hasOwnProperty(value)) {
    return localize(strings[value as keyof typeof strings]);
  }

  return value;
}

/**
 * Finds the index position after the last occurrence of `' > '` in the given string.
 * Useful for locating the final breadcrumb separator in a path-like string.
 *
 * @param s - The string to search within.
 * @returns The position just after the last `' > '` or 0 if not found.
 */
function findLastCarrot(s: string): number {
  let p = 0;
  const re = / > /g;

  if (re.test(s)) {
    let match = s.search(re);
    while (true) {
      p += match + 3;
      match = s.substring(p).search(re);

      if (match === -1) break;
    }
  }

  return p;
}

/**
 * Generate a unique command ID for the data model by replacing whitespace and periods,
 * and appending a number if necessary to ensure uniqueness.
 *
 * @param s - Base string to generate the ID from.
 * @returns A valid, unique command ID.
 */
function generateCommandId(s: string): string {
  const re = /\s|\./gi;
  let id = s.replace(re, "_");
  let n = 0;

  while (commandsData.hasOwnProperty(id)) {
    n++;
    id = s + n.toString();
  }

  return id;
}

/**
 * Ask the user if they want to add their new commands to their startup screen.
 *
 * @param newCommandIds - Array of new command IDs to add.
 * @returns `false` if the user declines to add commands, `undefined` otherwise.
 */
function addToStartup(newCommandIds: string[]): boolean | void {
  // Remove any command already in startupCommands
  for (let i = newCommandIds.length - 1; i >= 0; i--) {
    const newCommandId = newCommandIds[i];
    if (prefs.startupCommands.includes(newCommandId)) {
      newCommandIds.splice(i, 1);
    }
  }

  if (!newCommandIds.length) return;

  const confirmed = confirm(
    localize(strings.cd_add_to_startup),
    false,
    localize(strings.cd_add_to_startup_title)
  );

  if (!confirmed) return false;

  prefs.startupCommands = newCommandIds.concat(prefs.startupCommands);
}

/**
 * Get every unique font used inside the Illustrator document.
 *
 * @param doc - The Illustrator document object.
 * @returns An array of unique fonts used in the document.
 */
function getDocumentFonts(doc: Document): TextFont[] {
  const fonts: TextFont[] = [];

  for (let i = 0; i < doc.textFrames.length; i++) {
    const textFrame = doc.textFrames[i];

    for (let j = 0; j < textFrame.textRanges.length; j++) {
      const font = textFrame.textRanges[j].textFont;

      if (fonts.indexOf(font) === -1) {
        fonts.push(font);
      }
    }
  }

  return fonts;
}

/**
 * Reset view and zoom in on a specific page item in the active Illustrator document.
 *
 * @param pageItem - The page item to focus the view on.
 */
function zoomIntoPageItem(pageItem: PageItem): void {
  const view = app.activeDocument.views[0];

  // Get current screen dimensions
  const screenBounds = view.bounds;
  const screenW = screenBounds[2] - screenBounds[0];
  const screenH = screenBounds[1] - screenBounds[3];

  // Get page item's visible bounds and center
  const bounds = pageItem.visibleBounds;
  const itemW = bounds[2] - bounds[0];
  const itemH = bounds[1] - bounds[3];
  const itemCX = bounds[0] + itemW / 2;
  const itemCY = bounds[1] - itemH / 2;

  // Center the view on the page item
  view.centerPoint = [itemCX, itemCY];

  // Calculate zoom ratio
  const ratioW = screenW / itemW;
  const ratioH = screenH / itemH;
  const zoomRatio = itemW * (screenH / screenW) >= itemH ? ratioW : ratioH;

  // Apply zoom with a padding factor
  const padding = 0.9;
  view.zoom = zoomRatio * padding;
}

/**
 * Get information for all placed files in the current Illustrator document.
 * This includes file name, file path, and whether the file exists.
 *
 * @returns An array of localized strings containing file info for reporting.
 */
function getPlacedFileInfoForReport(): string[] {
  // Load AdobeXMPScript if not already available
  if (ExternalObject.AdobeXMPScript === undefined) {
    ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
  }

  // Parse XMP metadata from the current document
  const xmp = new XMPMeta(app.activeDocument.XMPString);
  const allFilePaths: string[] = getAllPlacedFilePaths(xmp);

  // Convert paths to File objects
  const fileObjects: File[] = allFilePaths.map((path) => new File(path));

  // Sort files by name
  fileObjects.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  // Build localized strings for each file
  const result: string[] = fileObjects.map((f, index) => {
    const fileInfo =
      localize(strings.dr_name) +
      decodeURI(f.name) +
      "\n" +
      localize(strings.dr_path) +
      f.fsName.replace(f.name, "") +
      "\n" +
      localize(strings.dr_file_found) +
      f.exists.toString().toUpperCase();

    return index === fileObjects.length - 1 ? fileInfo : fileInfo + "\n";
  });

  return result;
}

/**
 * Get all placed file paths (linked and embedded) from the document XMP metadata.
 * This bypasses issues with the `placedItems` collection in the Illustrator API.
 *
 * Credit to @pixxxelschubser via Adobe forums:
 * https://community.adobe.com/t5/user/viewprofilepage/user-id/7720512
 *
 * @param xmp - The parsed XMP metadata object for the current document.
 * @returns An array of file path strings.
 */
function getAllPlacedFilePaths(xmp: XMPMeta): string[] {
  const paths: string[] = [];

  // Iterate over all items in the xmpMM:Manifest array
  for (let i = 1; i <= xmp.countArrayItems(XMPConst.NS_XMP_MM, "Manifest"); i++) {
    const xpath = `xmpMM:Manifest[${i}]/stMfs:reference/stRef:filePath`;
    const prop = xmp.getProperty(XMPConst.NS_XMP_MM, xpath);
    if (prop != null && typeof prop.value === "string") {
      paths.push(prop.value);
    }
  }

  return paths;
}

/**
 * Check for any placed files with broken links in the current Illustrator document.
 *
 * This function parses the document's XMP metadata to find broken links listed under
 * `xmpMM:Ingredients`, which includes externally referenced files (e.g., missing linked images).
 *
 * @param xmp - The parsed XMP metadata object for the current document.
 * @returns An array of file path strings for the broken linked files.
 */
function getBrokenFilePaths(xmp: XMPMeta): string[] {
  const paths: string[] = [];

  for (let i = 1; i <= xmp.countArrayItems(XMPConst.NS_XMP_MM, "Ingredients"); i++) {
    const xpath = `xmpMM:Ingredients[${i}]/stRef:filePath`;
    const prop = xmp.getProperty(XMPConst.NS_XMP_MM, xpath);
    if (prop != null && typeof prop.value === "string") {
      paths.push(prop.value);
    }
  }

  return paths;
}

/**
 * Check whether a command is compatible with the current Illustrator version.
 *
 * Compares the system's Illustrator version against optional `minVersion` and `maxVersion`
 * properties on the command to determine if the command should be available.
 *
 * @param command - The command object to validate.
 * @returns True if the command is valid for the current Illustrator version, false otherwise.
 */
function commandVersionCheck(command: {
  minVersion?: number;
  maxVersion?: number;
}): boolean {
  const aiVersion = parseFloat(app.version);

  if (
    (command.minVersion !== undefined && command.minVersion > aiVersion) ||
    (command.maxVersion !== undefined && command.maxVersion < aiVersion)
  ) {
    return false;
  }

  return true;
}

/**
 * Compare two semantic version strings.
 *
 * @param a - First semantic version string (e.g. "1.2.3").
 * @param b - Second semantic version string (e.g. "1.2.0").
 * @returns 1 if `a` > `b`, -1 if `b` > `a`, 0 if they are equal.
 */
function semanticVersionComparison(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  const a_components = a.split(".");
  const b_components = b.split(".");

  const len = Math.min(a_components.length, b_components.length);

  for (let i = 0; i < len; i++) {
    const aNum = parseInt(a_components[i], 10);
    const bNum = parseInt(b_components[i], 10);

    if (aNum > bNum) {
      return 1;
    }

    if (aNum < bNum) {
      return -1;
    }
  }

  // If one's a prefix of the other, the longer one is considered greater
  if (a_components.length > b_components.length) {
    return 1;
  }

  if (a_components.length < b_components.length) {
    return -1;
  }

  return 0;
}

/**
 * Return the names of each object in an Illustrator collection object.
 * https://ai-scripting.docsforadobe.dev/scripting/workingWithObjects.html#collection-objects
 *
 * @param collection - Illustrator collection object with a `length` and `name` property on each item.
 * @param sorted - Whether the results should be sorted alphabetically.
 * @returns An array of names from the collection.
 */
function getCollectionObjectNames(
  collection: { length: number; typename: string; [index: number]: { name: string } },
  sorted: boolean = false
): string[] {
  const names: string[] = [];

  if (collection.length > 0) {
    for (let i = 0; i < collection.length; i++) {
      const item = collection[i];
      if (collection.typename === "Spots") {
        if (item.name !== "[Registration]") {
          names.push(item.name);
        }
      } else {
        names.push(item.name);
      }
    }
  }

  return sorted ? names.sort() : names;
}

/**
 * Present File.openDialog() for user to select files to load.
 *
 * @param prompt - Prompt text for the open dialog.
 * @param multiselect - Whether multiple files can be selected.
 * @param fileFilter - A file filter string (e.g., "*.js;*.jsx" or "JavaScript Files:*.js,*.jsx").
 * @returns An array of selected `File` objects, or an empty array if none selected.
 */
function loadFileTypes(
  prompt: string,
  multiselect: boolean,
  fileFilter: string
): File[] {
  const results: File[] = [];
  const files = File.openDialog(prompt, fileFilter, multiselect) as
    | File
    | File[]
    | null;

  if (files) {
    const selectedFiles = Array.isArray(files) ? files : [files];
    for (let i = 0; i < selectedFiles.length; i++) {
      results.push(selectedFiles[i]);
    }
  }

  return results;
}

/**
 * Simulate a key press for Windows users to fix a ScriptUI focus bug.
 *
 * This function addresses a known issue where, on some Windows versions of Illustrator,
 * setting `active = true` on a ScriptUI field causes a brief flash of Windows Explorer
 * before the Illustrator dialog comes to the front. This workaround, created by Sergey Osokin,
 * uses a temporary `.vbs` script to simulate a keypress and bring focus back cleanly.
 *
 * See: https://github.com/joshbduncan/AiCommandPalette/issues/8
 *
 * @param k - The key to simulate (e.g. "TAB", "ESC", etc.).
 * @param n - Number of times to simulate the keypress. Defaults to 1.
 */
function simulateKeypress(k: string, n: number = 1): void {
  let f: File;
  try {
    f = setupFileObject(settingsFolder, "SimulateKeypress.vbs");

    if (!f.exists) {
      let data = 'Set WshShell = WScript.CreateObject("WScript.Shell")\n';
      for (let i = 0; i < n; i++) {
        data += `WshShell.SendKeys "{${k}}"\n`;
      }

      f.encoding = "UTF-8";
      f.open("w");
      f.write(data);
    }

    f.execute();
  } catch (e) {
    $.writeln(e);
  } finally {
    if (f) f.close();
  }
}

/**
 * Open a URL in the system default browser.
 *
 * This function creates a temporary HTML file that redirects to the given URL,
 * and then opens it using the default system browser. Useful workaround for
 * opening links from ExtendScript (since `File.execute()` works on HTML files).
 *
 * @param url - The URL to open.
 */
function openURL(url: string): void {
  const html = new File(Folder.temp.absoluteURI + "/aisLink.html");
  html.open("w");

  const htmlBody =
    '<html><head><META HTTP-EQUIV="Refresh" CONTENT="0; URL=' +
    url +
    '"></head><body><p></p></body></html>';

  html.write(htmlBody);
  html.close();
  html.execute();
}
