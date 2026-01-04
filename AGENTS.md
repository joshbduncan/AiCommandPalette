# Agent Guidelines for Ai Command Palette

This document contains essential information for AI coding agents working on this Adobe Illustrator ExtendScript plugin project.

## Project Overview

This is an Adobe Illustrator Command Palette written in TypeScript, compiled to ES3 ExtendScript (Adobe's JavaScript engine). The project enables quick keyboard access to Illustrator's menu commands, tools, actions, scripts, bookmarks, and custom workflows.

**Key Constraint:** Code must compile to ES3-compatible JavaScript for Adobe Illustrator's ExtendScript engine.

## Build Commands

### TypeScript Build
```bash
npm run build              # Compile TypeScript to ES3
npm run dev               # Watch mode: build + copy on file changes
```

### Data Generation (Required before build)
```bash
npm run build-strings     # Generate localized strings from CSV
npm run build-commands    # Generate command data from CSV
```

### Post-Build Steps (Automatic)
These run automatically after `npm run build`:
- `postbuild:strip-ts-comments` - Remove TypeScript comments
- `postbuild:wrap-in-anon-func` - Wrap in anonymous function
- `postbuild:prettier` - Format final output

### Deploy to Illustrator
```bash
npm run copy-to-ai        # Copy to Illustrator scripts folder (macOS)
```

### Testing
- **No automated tests** - Manual testing in Adobe Illustrator required
- Test files: `tests/manual_command_testing.jsx`, `tests/test_tool_commands.jsx`
- Run tests by executing them in Illustrator

### Python Scripts
```bash
python3 scripts/build_strings.py    # Generate strings TypeScript
python3 scripts/build_commands.py   # Generate commands TypeScript
```

### Pre-commit Hooks
Configured in `.pre-commit-config.yaml`:
- Runs build-strings, build-commands, and build automatically before commits

## Code Style Guidelines

### Formatting (Prettier)
- **Indentation:** 4 spaces (no tabs)
- **Line width:** 88 characters
- **Quotes:** Double quotes for strings
- **Semicolons:** Required
- **Trailing commas:** ES5 style (arrays/objects only)
- **Arrow parens:** Always use parentheses `(x) => x`

### TypeScript Configuration
- **Target:** ES3 (critical for ExtendScript compatibility)
- **Output:** Single file bundle at `build/bundle.jsx`
- **Comments:** `removeComments: false` (stripped in post-build)
- **Types:** `types-for-adobe/Illustrator/2022`
- **Strict:** `alwaysStrict: false` (ES3 limitation)

### Naming Conventions
- **Functions:** camelCase - `processCommand()`, `determineCorrectString()`
- **Classes:** PascalCase - `Logger`, `ListBoxWrapper`
- **Constants:** camelCase or UPPER_CASE for true constants - `pluginDataFolder`, `visibleListItems`
- **Types:** PascalCase - `CommandEntry`, `PaletteSettings`, `ColumnConfig`
- **Private class members:** Use `private` keyword - `private file: File`
- **File names:** camelCase.ts - `commandPalette.ts`, `processing.ts`

### Imports and Exports
- **No ES6 imports/exports** - All files compile to a single bundle
- Files are concatenated in order specified in `tsconfig.json` "files" array
- Global scope - functions/variables are globally available after compilation
- Order matters - dependencies must come before usage in the file list

### Type Annotations
- **Always use explicit types** for function parameters and return values
- **Type complex objects** - Create interfaces/types for objects
- **Use type guards** when necessary - `isLocalizedEntry()`, `commandVersionCheck()`
- **Avoid `any`** - Use specific types or `unknown` when type is truly unknown
- Example:
  ```typescript
  function determineCorrectString(command: CommandEntry, prop: string): string {
      // Implementation
  }
  ```

### Error Handling
- **Try-catch for I/O operations** - File operations, XMP parsing, external scripts
- **User-friendly alerts** - Use localized strings for error messages
- **Graceful degradation** - Check existence before operations
- **Logging** - Use `logger.log()` for debugging (dev mode)
- Example:
  ```typescript
  try {
      func(command);
  } catch (e) {
      alert(localize(alertString, name, e.message));
  }
  ```

### Comments and Documentation
- **JSDoc for all functions** - Include `@param`, `@returns`, description
- **Explain complex logic** - Especially ExtendScript workarounds
- **Credit sources** - Link to forums/documentation when using external solutions
- **Type annotations in JSDoc** - Helps with type inference
- Example:
  ```typescript
  /**
   * Generate a unique command ID for the data model by replacing whitespace and periods,
   * and appending a number if necessary to ensure uniqueness.
   *
   * @param s - Base string to generate the ID from.
   * @returns A valid, unique command ID.
   */
  function generateCommandId(s: string): string {
      // Implementation
  }
  ```

### ExtendScript-Specific Patterns

#### ES3 Compatibility
- **No arrow functions in compiled output** - TypeScript compiles them down
- **No `const`/`let` in output** - All become `var`
- **No template literals** - Use string concatenation
- **Use for loops** - Not `forEach`, `map`, etc. (though TypeScript allows)
- **Array checks:** Use `Array.isArray()` polyfill or `instanceof Array`

#### File I/O Pattern
```typescript
const f = setupFileObject(folder, "filename.json");
f.encoding = "UTF-8";
f.open("w");  // or "r" for read
f.write(data);
f.close();
```

#### Localization Pattern
```typescript
// String definitions
const strings = {
    key: {
        en: "English",
        de: "Deutsch",
        ru: "Русский"
    }
};

// Usage
localize(strings.key);
```

#### Type Checking Pattern
```typescript
// Check if object has expected structure
function isLocalizedEntry(value: any): value is LocalizedStringEntry {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value).every(
            (key) => typeof key === "string" && typeof (value as any)[key] === "string"
        )
    );
}
```

### Platform Differences
- **Windows flicker fix:** Use `simulateKeypress()` for dialog focus (Windows + AI < 26.4)
- **OS detection:** Use `sysOS` constant (`"mac"` or `"win"`)
- **File paths:** Use `File.fsName` for system paths, handle both Unix/Windows separators

## Project Structure

- `src/` - TypeScript source files (compiled to single bundle)
- `data/` - CSV files for commands and strings
- `polyfills/` - ES3 polyfills for modern JavaScript features
- `scripts/` - Python build scripts for data generation
- `tests/` - Manual test scripts for Adobe Illustrator
- `build/bundle.jsx` - Compiled TypeScript output
- `AiCommandPalette.jsx` - Final processed script for Illustrator

### Critical Files
- `src/index.ts` - Entry point (last in compilation order)
- `src/config.ts` - Global configuration and constants
- `src/data/built_strings.ts` - Generated localized strings
- `src/data/built_commands.ts` - Generated command data
- `tsconfig.json` - Defines compilation order and settings

## Development Workflow

1. **Edit source files** in `src/` directory
2. **Update CSV data** if adding/modifying commands or strings
3. **Run data generation** if CSV changed: `npm run build-strings build-commands`
4. **Build TypeScript:** `npm run build`
5. **Test in Illustrator** by running `AiCommandPalette.jsx`
6. **Use dev mode** for automatic rebuild/copy: `npm run dev`

### Development Mode Detection
```typescript
const devMode = $.getenv("USER") === "jbd" ? true : false;
const debugLogging = $.getenv("AICP_DEBUG_LOGGING") !== "false" ? true : false;
```

## Important Notes

- **Single file output:** All TypeScript compiles to one `.jsx` file
- **Global namespace:** No module system, everything is global
- **Order matters:** File compilation order in `tsconfig.json` is critical
- **ExtendScript quirks:** Research Adobe ExtendScript limitations before using modern JS
- **No NPM runtime dependencies:** `types-for-adobe` is dev-only
- **Localization:** Support English (en), German (de), Russian (ru)
- **Pre-commit hooks:** Automatically build before committing

## Resources

- [ExtendScript Toolkit](https://ai-scripting.docsforadobe.dev/)
- [ScriptUI for Dummies](https://adobeindd.com/view/publications/a0207571-ff5b-4bbf-a540-07079bd21d75/92ra/publication-web-resources/pdf/scriptui-2-16-j.pdf)
- [Adobe Illustrator API](https://ai-scripting.docsforadobe.dev/scripting/)
