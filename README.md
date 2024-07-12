# Ai Command Palette

Boost your Adobe Illustrator efficiency with quick access to **most Menu Commands** and **Tools**, all of your **Actions**, **Bookmarked** file or folder, and any **Scripts** right from your keyboard.

And, with custom **Workflows**, you can combine multiple commands, actions, and scripts to get things done in your own way. Replace repetitive tasks with workflows and boost your productivity.

!["Ai Command Palette"](/images/palette.png)

## Why?

If you have worked with Alfred app or VS Code you know how great the “command palette” is… Well, I wanted that same functionality in Adobe Illustrator.

## Video Demo

[![Ai Command Palette Demo Video](/images/ai-command-palette-youtube-1.png)](https://www.youtube.com/watch?v=Jhh_Dvfs0ro)

## Features

### Menu Commands

With nearly 500 Menu Commands available to Ai Command Palette ([view all here](https://docs.google.com/spreadsheets/d/1T-pBrLAOL3WuF1K7h6Wo_vIUa0tui9YiX591YqqKMdA/edit#gid=716124557)), there isn't much you can't access. I have tested all of them on Adobe Illustrator v26.4.1.

!["Built-In Menu Commands"](/images/menu-commands.png)

### Tools

Quickly access over almost 80 of Ai's built-in Tools ([view all here](https://docs.google.com/spreadsheets/d/1T-pBrLAOL3WuF1K7h6Wo_vIUa0tui9YiX591YqqKMdA/edit#gid=1114705496)) right from your keyboard without having to remember so many keyboard shortcuts.

!["Built-In Tools"](/images/tool-commands.png)

### Actions

Access all of your saved Actions using Ai Command Palette. Actions are listed "Action: Action Name [Action Set]" to make searching/accessing easy. If you create a new action you will have to quit Illustrator and reopen before it will become available in Ai Command Palette.

!["Actions"](/images/actions.png)

## Bookmarks

Find yourself opening the same file inside of Illustrator multiple times a day? Or need to easily access a folder full of project assets? Bookmarks have you covered.

📝 File bookmarks open right into Illustrator and Folder bookmarks open in your file system.

!["Actions"](/images/bookmarks.png)

### Custom Pickers

In need of a custom command palette picker for something you do on a regular basis, or want to enhance a script you already use with a the ability to pick from a set of options? Use the `Build Picker...` command to create your very own searchable command palette. These are also great for use in [workflows](#workflows).

!["Actions"](/images/custom-picker.png)

The selected item will be saved to the environment variable `aic_picker_last` and can be accessed via a script using `$.getenv("aic_picker_last")`.

Custom Pickers also allow for multiple selections. When enabled, the selected items are saved as an array so to access them make sure to use the [eval()](https://extendscript.docsforadobe.dev/integrating-external-libraries/defining-entry-points-for-indirect-access.html#eval) method like below.

ℹ️ Any custom pickers inside of workflows can be edited inside of the workflow editor by double-clicking the picker workflow step, or by clicking the workflow steps edit button.

```javascript
// anotherScript.jsx
var colorFormats = eval($.getenv("aic_picker_last"));
alert("Picked Color Formats\n" + colorFormats.join("\n"));
```

### Scripts

Load any JavaScript files (.js or .jsx) you want quick access to using the `Load Scripts...` command.

❓ **Want to load a bunch of scripts?** Multiple selections are allowed using your standard OS multiple selection tools.

!["Scripts"](/images/scripts.png)

### Workflows

Build fully automated automation workflows using Menu Commands, Tools, Actions, Scripts, or even other Workflows 🤯!

Do You...
- need to combine multiple scripts into one action?
- need to add functionality to a script but don't know how or have the time?
- need to perform an exact set of actions regularly and want to automate that?
- need to quickly prototype the execution steps of a potential script?

🧨 Workflows are a super powerful utility for beginners, pros, and everyone in between. The possibilities are almost limitless!

!["Workflow Builder"](/images/workflow-builder.png)

The simple workflow above takes your current selection of objects, blends them together, opens the blend options dialog so you can make any necessary adjustments, then expands your blend, and saves your file with an action.

## Go To Functionality

Without leaving your keyboard, quickly jump to a specific artboard, pop to another open document, or zoom in on a specific names object.

!["Go To"](/images/go-to-functionality.png)

## Document Report

Illustrators Document Info palette offers lots of great info  but it can be a little cumbersome to work with. To quickly get right to the info you need, Ai Command Palette offers a quick Document Report that includes, most of the basic info like fonts, artboards, placed image details, spot colors, etc... You can even save it out for future reference.

!["Go To"](/images/document-report.png)

## Additional Built-In Commands

Ai Command Palette has access to most of Illustrator's functionality via the menu command system but there are some features only available (or much easier to access) via the API that I have added as I encounter them.

- Redraw Windows
- Reveal Active Document On System
- Export Active Artboard As PNG
- Export Document Variables

## Settings

You can access the settings for Ai Command Palette by selecting the "Command Palette Settings..." option (or via search). Most settings are self explanatory but I'll cover a few here to try and makes things clear.

### Hide Commands...

If there are any Actions, built-in Menu Commands, or built-in Tools you don't want to see in Ai Command Palette you can easily hide them. Note, they will not be deleted, just hidden from the search results.

❓ **Need to hide a bunch of commands?** Multiple selections are allowed using your standard OS multiple selection tools.

❓ **Accidentally hide a command you didn't mean to?** To reveal any hidden commands, just use the "Reveal Commands..." function of Ai Command Palette.

### Reveal Preferences File

All of your Ai Command Palette settings are saved on your system to a "json-like" preferences file. This includes any Scripts you load, Workflows you create, and Commands you have hidden. This command simply "reveals" your preferences file on your system.

⚠️ I would not recommend directly editing the file unless you know exactly what you are going. This function is mostly for making backups or sharing your preferences with others.

## Localization

With the help of [Kurt Gold](https://community.adobe.com/t5/user/viewprofilepage/user-id/8354168) and [Sergey Osokin](https://github.com/creold), Ai Command Palette is currently localized for German and Russian versions of Illustrator. This includes all dialogs, alerts, menu commands, and tools.

If anyone wants to offer localization for other languages you can [learn more here](/localization.md).

!["Localization"](/images/localization.png)

## Installation

I recommend installing this action into your scripts folder ([how-to](https://www.marspremedia.com/software/how-to-adobe-cc#illustrator)), then tying it to a keyboard shortcut using something like [Keyboard Maestro](https://www.keyboardmaestro.com/main/) (Mac), [BetterTouchTool](https://folivora.ai/) (Mac), or [AutoHotkey](https://www.autohotkey.com/) (Windows).

ℹ️ I like to use the keyboard shortcut Command-Shift-P since it is somewhat mnemonic for "palette".

## Known Issues 🤦‍♂️

### Keyboard Use

Ai Command Palette was created to allow users to stay away from the mouse and do actions and operations via the keyboard. Funnily enough, there is a bug in ExtendScript that will delay/send the `Enter` key event after the palette is dismissed using the enter key.

This issue doesn't effect very many actions and you may never notice it, but if you run the `About Illusatrator...` command, you'll notice it appears and immediately disappears. This is because ExtendScript essentially "presses" the enter key after showing the about splash screen.

I have tried lots of work-a-rounds to fix this but haven't found a solution yet.

### Moving Between Palette Options Using Arrow Keys

I have noticed that after some time without restarting Illustrator, the arrow keys stop moving up and down between palette options. Not sure of the cause but restarting Illustrator will get everything back operating normally.

### Running Actions 

There is a known ExtendScript issue when running actions from a script (e.g. Ai Command Palette). Some action steps **WILL NOT** work properly. I haven't tested all possible action but I know for sure most operations modifying the document selection are definitely broken. Let me know if you find others and I will file/update a bug report with Adobe.

## Warning ‼️

Using Ai Command Palette requires some basic knowledge of Illustrator. The script doesn't know which commands can or can't be run at the time of execution so tread carefully. I've included error checking where possible, so in most cases you should get an explanation when something breaks.

⚠️ Action Execution: There are some known issues with executing actions via a script. There are no known solutions to this so if you encounter errors with a particular Action, it just may not be suitable to execute via Ai Command Palette.

🐞 If you find a bug please [file an issue](https://github.com/joshbduncan/AiCommandPalette/issues).

😬 Also know, most every action this script executes can be undone by choosing Edit > Undo (from the Edit menu at the top of your screen), or by pressing Command-Z (Mac) or Control+Z (Windows).

## Credits

### Localization
- [Kurt Gold](https://community.adobe.com/t5/user/viewprofilepage/user-id/8354168) for his work localizing the German.
- [Sergey Osokin](https://github.com/creold) for his work localizing the Russian version.

## Testing
- [Kurt Gold](https://community.adobe.com/t5/user/viewprofilepage/user-id/8354168)
- [Sergey Osokin](https://github.com/creold)

### Built-In Menu Commands and Tools
- [krasnovpro](https://community.adobe.com/t5/user/viewprofilepage/user-id/9425584)
- [Shalako Lee](https://github.com/shalakolee)
- [sttk3](https://judicious-night-bca.notion.site/app-executeMenuCommand-43b5a4b7a99d4ba2befd1798ba357b1a)

### Other
- Peter Kahrel for the amazing book [ScriptUI for Dummies](https://adobeindd.com/view/publications/a0207571-ff5b-4bbf-a540-07079bd21d75/92ra/publication-web-resources/pdf/scriptui-2-16-j.pdf).
- [Sergey Osokin](https://github.com/creold)
    - For his clever `openURL()` function
    - For his help fixing the [Windows OS bug · Issue #8](https://github.com/joshbduncan/AiCommandPalette/issues/8)
- [sttk3](https://community.adobe.com/t5/illustrator-discussions/get-names-of-actions-in-some-set/td-p/10365284) for the awesome bit of code that extracts current actions.
