# Notes

Just some notes to help me remember how things work...

## Command Objects

Every command is a simple object like below.

```json
{
  "id": "menu_new",
  "action": "new",
  "type": "menu",
  "name": {
    "en": "File > New...",
    "de": "Datei > Neu...",
    "ru": "Файл > Новый...",
  },
  "docRequired": false,
  "selRequired": false,
  "hidden": false,
}
```

### Command Object Examples

All commands object have a standard set of properties, but different types of commands may also have extra properties.

### Action

```json
{
  "id": "action_sample_action",
  "action": "action",
  "type": "action",
  "set": "Sample Action Set",
  "name": "Sample Action",
  "docRequired": false,
  "selRequired": false,
  "hidden": false,
}
```

### Bookmark (File or Folder)

```json
{
  "id": "bookmark_Awesome_Vectors_ai",
  "action": "bookmark",
  "type": "file", // or "folder"
  "path": "/path/to/awesome/vectors/Awesome Vectors.ai",
  "name": "Awesome Vectors.ai",
  "docRequired": false,
  "selRequired": false,
  "hidden": false,
}
```

### Menu

```json
{
  "id": "menu_new",
  "action": "new",
  "type": "menu",
  "name": {
    "en": "File > New...",
    "de": "Datei > Neu...",
    "ru": "Файл > Новый...",
  },
  "docRequired": false,
  "selRequired": false,
  "hidden": false,
}
```

### Script

```json
{
  "id": "script_Automate_Something_jsx",
  "action": "script",
  "type": "script",
  "path": "/path/to/automation/scripts/Automate Something.jsx",
  "name": "Automate Something.jsx",
  "docRequired": false,
  "selRequired": false,
  "hidden": false,
}
```

### Tool

```json
{
  "id": "tool_Adobe_Direct_Select_Tool",
  "action": "Adobe Direct Select Tool",
  "type": "tool",
  "name": {
    "en": "Direct Selection Tool",
    "de": "Direktauswahl-Werkzeug",
    "ru": "Инструмент: Прямое выделение",
  },
  "minVersion": 24,
  "docRequired": true,
  "selRequired": false,
  "hidden": false,
}
```

### Workflow

```json
{
  "id": "workflow_time_saving_workflow",
  "action": "workflow",
  "type": "workflow",
  "actions": ["menu_command", "tool_command", "script", "other_workflow"],
  "name": "Time Saving Workflow",
  "docRequired": false,
  "selRequired": false,
  "hidden": false,
}
```