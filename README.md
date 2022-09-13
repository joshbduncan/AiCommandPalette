# Ai Command Palette

Boost your Adobe Illustrator efficiency with quick access to **most Menu Commands** and **Tools**, all of your **Actions**, and any **Scripts** right from your keyboard.

And, with custom **Workflows**, you can combine multiple commands, actions, and scripts to get things done in your own way. Replace repetitive tasks with workflows and boost your productivity.

!["Ai Command Palette"](/images/palette.png)

## Why?

If you have worked with Alfred app or VS Code you know how great the “command palette” is… Well, I wanted that same functionality in Adobe Illustrator.

## Video Demo

[![Ai Command Palette Demo Video](/images/ai-command-palette-youtube-1.png)](https://www.youtube.com/watch?v=Jhh_Dvfs0ro)

## Features

### Menu Commands

With nearly 500 Menu Commands available to Ai Command Palette ([view all here](/commands/menu_commands.csv), there isn't much you can't access. I have tested all of them on Adobe Illustrator v26.4.1.

!["Built-In Menu Commands"](/images/builtin-commands.png)

### Tools

Quickly access over almost 80 of Ai's built-in Tools right from your keyboard without having to remember so many keyboard shortcuts.

!["Built-In Tools"](/images/builtin-tools.png)

### Actions

Access all of your saved Actions using Ai Command Palette. Actions are listed "Action: Action Name [Action Set]" to make searching/accessing easy. If you create a new action you will have to quit Illustrator and reopen before it will become available in Ai Command Palette.

!["Actions"](/images/actions.png)

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

!["Built-In Tools"](/images/workflow-builder.png)

The simple workflow above takes your current selection of objects, blends them together, opens the blend options dialog so you can make any necessary adjustments, then expands your blend, and saves your file with an action.

## Settings

You can access the settings for Ai Command Palette by selecting the "Command Palette Settings..." option (or via search). Most settings are self explanatory but I'll cover a few here to try and makes things clear.

### Workflows Needing Attention...

Whenever you delete a command from Ai Command Palette, be it an Action, Script, or Workflow, any workflows that used that command will no longer work. This will also happen if a workflow you are using includes a command or tool that doesn't meet the minimum/maximum requirements for your current version of Adobe Illustrator.

The "Workflows Needing Attention..." command allows you to see any workflows that need to be fixed. After selecting a workflow that needs attention, you'll be taken to the Workflow Editor to either delete or replace the offending command(s).

!["Workflow Needing Attention"](/images/workflow-needing-attention.png)

### Show All Built-In Commands...

If you can't seem to find the built-in Menu Command you are looking for or if you have hidden some (using the "Hide Commands..." function) you can access a full list of them here. The list is sorted just like Ai's menu system to make things easier to find.

❓ **Still can't find the command you are looking for?** Well, it either is not available via the ExtendScript API or is new and hasn't been implemented into Ai Command Palette yet.

### Show All Built-In Tools...

Same as above "Show All Built-In Commands..." just for the built-in Tools offered by Adobe Illustrator.

### Hide Commands...

If there are any Actions, built-in Menu Commands, or built-in Tools you don't want to see in Ai Command Palette you can easily hide them. Note, they will not be deleted, just hidden from the search results.

❓ **Need to hide a bunch of commands?** Multiple selections are allowed using your standard OS multiple selection tools.

❓ **Accidentally hide a command you didn't mean to?** To reveal any hidden commands, just use the "Reveal Commands..." function of Ai Command Palette.

### Reveal Preferences File

All of your Ai Command Palette settings are saved on your system to a "json-like" preferences file. This includes any Scripts you load, Workflows you create, and Commands you have hidden. This command simply "reveals" your preferences file on your system.

⚠️ I would not recommend directly editing the file unless you know exactly what you are going. This function is mostly for making backups or sharing your preferences with others.

## Localization

With the help of [Kurt Gold](https://community.adobe.com/t5/user/viewprofilepage/user-id/8354168) and [Sergey Osokin](https://github.com/creold), Ai Command Palette is currently localized for German and Russian versions of Illustrator. This includes all dialogs, alerts, menu commands, and tools.

To make this easier in the future (for new versions or other languages), I built a [simple translation utility](/tools/build_translations.py) in Python.

If anyone wants to offer localization for other languages you can [learn more here](/localization/README.md).

!["Localization"](/images/localization.png)

## Installation

I recommend installing this action into your scripts folder ([how-to](https://www.marspremedia.com/software/how-to-adobe-cc#illustrator)), then tying it to a keyboard shortcut using something like [Keyboard Maestro](https://www.keyboardmaestro.com/main/) (Mac), [BetterTouchTool](https://folivora.ai/) (Mac), or [AutoHotkey](https://www.autohotkey.com/) (Windows).

ℹ️ I like to use the keyboard shortcut Command-Shift-P since it is somewhat mnemonic for "palette".

## ‼️ Warning ‼️

Using Ai Command Palette requires some basic knowledge of Illustrator. The script doesn't know which commands can or can't be run at the time of execution so tread carefully. I've included error checking where possible, so in most cases you should get an explanation when something breaks.

🐞 If you find a bug please [file an issue](https://github.com/joshbduncan/AiCommandPalette/issues).

😬 Also know, most every action this script executes can be undone by choosing Edit > Undo (from the Edit menu at the top of your screen), or by pressing Command-Z (Mac) or Control+Z (Windows).

## Credits

### Localization
- [Kurt Gold](https://community.adobe.com/t5/user/viewprofilepage/user-id/8354168) for his work localizing the German.
- [Sergey Osokin](https://github.com/creold) for his work localizing the Russian version.

### Built-In Menu Commands and Tools
- [krasnovpro](https://community.adobe.com/t5/user/viewprofilepage/user-id/9425584)
- [Shalako Lee](https://github.com/shalakolee)
- [sttk3](https://judicious-night-bca.notion.site/app-executeMenuCommand-43b5a4b7a99d4ba2befd1798ba357b1a)

### Other
- Peter Kahrel for the amazing book [ScriptUI for Dummies](https://adobeindd.com/view/publications/a0207571-ff5b-4bbf-a540-07079bd21d75/92ra/publication-web-resources/pdf/scriptui-2-16-j.pdf).
- [Sergey Osokin](https://github.com/creold) for the clever `openURL()` function.
- [sttk3](https://community.adobe.com/t5/illustrator-discussions/get-names-of-actions-in-some-set/td-p/10365284) for the awesome bit of code that extracts current actions.
