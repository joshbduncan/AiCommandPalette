# Notes

Just some notes to help me remember how things work...

## Data Object

Simplified version of the base `data` object.

```json
{
  "commands": {
    "bookmark": {
      "Bookmark: Awesome Vector Goodness.aI": {
        "name": "Awesome Vector Goodness.aI",
        "type": "bookmark",
        "path": "/Users/jbd/Desktop/Awesome Vector Goodness.aI",
        "bookmarkType": "file"
      },
      "Bookmark: Mockup Layout Files": {
        "name": "Mockup Layout Files",
        "type": "bookmark",
        "path": "/Users/jbd/Desktop/Mockup Layout Files",
        "bookmarkType": "folder"
      }
    },
    "script": {
      "Script: Time Saving Ai Script.jsx": {
        "name": "Time Saving Ai Script.jsx",
        "type": "script",
        "path": "/Users/jbd/Desktop/Time Saving Ai Script.jsx"
      },
      "workflow": {
        "Workflow: Cool Automation Workflow": {
          "name": "Cool Automation Workflow",
          "type": "workflow",
          "actions": [
            "Bookmark: Awesome Vector Goodness.aI"
          ]
        }
      },
      "defaults": {
        "defaults_settings": {
          "action": "settings",
          "type": "defaults",
          "docRequired": false,
          "loc": {
            "en": "Ai Command Palette Settings...",
            "de": "Kurzbefehle – Einstellungen …",
            "ru": "Настройки"
          }
        }
      },
      "menu": {
        "menu_new": {
          "action": "new",
          "type": "menu",
          "docRequired": false,
          "loc": {
            "en": "File > New...",
            "de": "Datei > Neu …",
            "ru": "Файл > Новый..."
          }
        }
      },
      "tool": {
        "tool_Adobe Add Anchor Point Tool": {
          "action": "Adobe Add Anchor Point Tool",
          "type": "tool",
          "docRequired": true,
          "loc": {
            "en": "Add Anchor Point Tool",
            "de": "Ankerpunkt-hinzufügen-Werkzeug",
            "ru": "Инструмент: Добавить опорную точку"
          },
          "minVersion": 24
        }
      },
      "action": {
        "Action: Blend dat [JBD]": {
          "name": "Blend dat",
          "type": "action",
          "set": "JBD"
        }
      },
      "builtin": {
        "builtin_goToArtboard": {
          "action": "goToArtboard",
          "type": "builtin",
          "docRequired": true,
          "loc": {
            "en": "Go To Artboard...",
            "de": "Gehen Sie zur Zeichenfläche...",
            "ru": "Gehen Sie zur Zeichenfläche..."
          }
        }
      },
      "config": {
        "config_about": {
          "action": "about",
          "type": "config",
          "docRequired": false,
          "loc": {
            "en": "About Ai Command Palette...",
            "de": "Über Kurzbefehle …",
            "ru": "Об Ai Command Palette"
          }
        }
      }
    },
    "settings": {
      "hidden": [],
      "name": "Ai Command Palette",
      "version": "0.6.1",
      "os": "Macintosh OS 12.6.0/64",
      "locale": "en_US",
      "aiVersion": 27.4
    },
    "recent": {
      "commands": [
        "File > New..."
      ]
    }
  }
}
```

## Data Object Samples

Object samples from `commandsData`.

### Action

```json
"Action: Blend dat [JBD]": {
  "name": "Blend dat",
  "type": "action",
  "set": "JBD"
}
```

### Bookmark (File)

```json
"Bookmark: Awesome Vector Goodness.aI": {
  "name": "Awesome Vector Goodness.aI",
  "type": "bookmark",
  "path": "/Users/jbd/Desktop/Awesome Vector Goodness.aI",
  "bookmarkType": "file"
}
```

### Bookmark (Folder)

```json
"Bookmark: Mockup Layout Files": {
  "name": "Mockup Layout Files",
  "type": "bookmark",
  "path": "/Users/jbd/Desktop/Mockup Layout Files",
  "bookmarkType": "folder"
}
```

### Built-In/Config/Settings

```json
"Ai Command Palette Settings...": {
  "action": "settings",
  "type": "defaults",
  "docRequired": false,
  "selRequired": false,
  "loc": {
    "en": "Ai Command Palette Settings...",
    "de": "Kurzbefehle – Einstellungen …",
    "ru": "Настройки"
  }
}
```

### Menu

```json
"File > New...": {
  "action": "new",
  "type": "menu",
  "docRequired": false,
  "selRequired": false,
  "loc": {
    "en": "File > New...",
    "de": "Datei > Neu …",
    "ru": "Файл > Новый..."
  }
}
```

### Script

```json
"Script: Time Saving Ai Script.jsx": {
  "name": "Time Saving Ai Script.jsx",
  "type": "script",
  "path": "/Users/jbd/Desktop/Time Saving Ai Script.jsx"
}
```

### Tool

```json
"Add Anchor Point Tool": {
  "action": "Adobe Add Anchor Point Tool",
  "type": "tool",
  "docRequired": true,
  "selRequired": false,
  "loc": {
    "en": "Add Anchor Point Tool",
    "de": "Ankerpunkt-hinzufügen-Werkzeug",
    "ru": "Инструмент: Добавить опорную точку"
  },
  "minVersion": 24
}
```

### Workflow

```json
"Workflow: Cool Automation Workflow": {
  "name": "Cool Automation Workflow",
  "type": "workflow",
  "actions": [
    "Bookmark: Awesome Vector Goodness.aI"
  ]
}
```