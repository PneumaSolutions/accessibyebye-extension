## Temporary Firefox Release Instructions

First, run `yarn build` to output the `dist/` directory.

### In `dist/manifest.json`
1. Change the background scripts to the following (remove `js/hot_reload.js` item).
```json
  "background": {
    "scripts": ["js/background.js"]
  },
```
2. Add the following entry to the end of the file.
```json
  "browser_specific_settings": {
    "gecko": {
      "id": "AccessiByeBye@accessibyebye.org"
    }
  }
```

### In `dist/js/`
3. Delete `hot_reload.js`

### In `dist/`
4. Zip the contents of the folder (not the folder) and release