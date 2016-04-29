var fs = require('fs');
fs.readFile('nativescript/tsconfig.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  // temporary fix until this: https://github.com/NativeScript/nativescript-angular/issues/205
  var fix = '{\n' +
    '  "compilerOptions": {\n' +
    '    "module": "commonjs",\n' +
    '    "target": "es5",\n' +
    '    "sourceMap": true,\n' +
    '    "experimentalDecorators": true,\n' +
    '    "emitDecoratorMetadata": true\n' +
    '  },\n' +
    '  "exclude": [\n' +
    '    "node_modules",\n' +
    '    "platforms"\n' +
    '  ]\n' +
    '}';

  fs.writeFile('nativescript/tsconfig.json', fix, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
