# Notes

Just some notes to help me remember how things work...

## Command Objects

Every command is a simple object like below.

```typescript
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

```typescript
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

```typescript
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

```typescript
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

```typescript
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

```typescript
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

```typescript
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

## Data/Object Models

### recentCommands

```typescript
const recentCommands = {
  command: 3 // command: count of times found in history
}
```

### recentQueries

```typescript
const recentQueries = ["query"]
```

### mostRecentCommands

The 25 most recent commands.

```typescript
const mostRecentCommands = [command]
```

### latches

```typescript
const latches = {
  "query": command // user query: command
}
```

### queryCommandsLUT

```typescript
const queryCommandsLUT = {
  "query": { // user query
    command: 3 // matching command: count of times found in user history
  }
}
```