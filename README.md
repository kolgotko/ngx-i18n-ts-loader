# ngx-i18n-ts-loader

### Example
custom-webpack.config.js:
```javascript
const path = require('path');
const { 
  loadTransUnitMap,
  createProgram,
  createPrinter,
} = require('@kolgotko/ngx-i18n-ts-common');

const projectDir = path.resolve(__dirname, 'src');
const program = createProgram([projectDir]);
const printer = createPrinter();
const transUnitMap = loadTransUnitMap(path.resolve(__dirname, 'path/to/i18n-dir/messages.en.xlf'));

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: {
          loader: '@kolgotko/ngx-i18n-ts-loader',
          options: {
            transUnitMap,
            program,
            printer,
          },
        },
      },
    ],
  },
};
```
