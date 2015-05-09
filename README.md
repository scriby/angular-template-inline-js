angular-template-inline-js
==========================

Inline templates into js files to simplify testing and remove HTTP requests

### Installation

```
npm install angular-template-inline-js
```

### CLI
#### arguments

- `--basePath` specifies base directory (default value is current directory)
- `--key` specifies keys where template should be inlined (default=`templateUrl`)
- `--output` specifies where the compiled file should be save (relative to basePath)

#### example usage with `package.json`
```json
"scripts": {
  "inline-piped-content": "cat app.js | template-inline --output dist/app.js",
  "inline-file-content": "template-inline: template-inline --output dist/app.js app.js"
}
```
Then on command line run:
`npm run inline-piped-content`
