var fs = require('fs');
var path = require('path');

var fixTsConfig = function () {
  var tsConfig = 'nativescript/tsconfig.json';
  fs.readFile(tsConfig, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var fix = '{\n' +
      '    "compilerOptions": {\n' +
      '        "target": "es5",\n' +
      '        "module": "commonjs",\n' +
      '        "declaration": false,\n' +
      '        "removeComments": true,\n' +
      '        "noLib": false,\n' +
      '        "emitDecoratorMetadata": true,\n' +
      '        "experimentalDecorators": true,\n' +
      '        "lib": [\n' +
      '            "dom"\n' +
      '        ],\n' +
      '        "sourceMap": true,\n' +
      '        "pretty": true,\n' +
      '        "allowUnreachableCode": false,\n' +
      '        "allowUnusedLabels": false,\n' +
      '        "noImplicitAny": false,\n' +
      '        "noImplicitReturns": true,\n' +
      '        "noImplicitUseStrict": false,\n' +
      '        "noFallthroughCasesInSwitch": true,\n' +
      '        "typeRoots": [\n' +
      '            "node_modules/@types",\n' +
      '            "node_modules"\n' +
      '        ],\n' +
      '        "types": [\n' +
      '            "jasmine"\n' +
      '        ]\n' +
      '    },\n' +
      '    "exclude": [\n' +
      '        "node_modules",\n' +
      '        "platforms"\n' +
      '    ],\n' +
      '    "compileOnSave": false\n' +
      '}';

    fs.writeFile(tsConfig, fix, 'utf8', function (err) {
      if (err) return console.log(err);
      fixPackage();
    });
  });
};

var fixPackage = function () {
  var packagePath = 'nativescript/package.json';
  fs.readFile(packagePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    var fix = '{\n' +
      '  "nativescript": {\n' +
      '    "id": "org.nativescript.nativescript",\n' +
      '    "tns-ios": {\n' +
      '      "version": "2.3.0"\n' +
      '    }\n' +
      '  },\n' +
      '  "dependencies": {\n' +
      '    "@angular/common": "~2.1.1",\n' +
      '    "@angular/compiler": "~2.1.1",\n' +
      '    "@angular/core": "~2.1.1",\n' +
      '    "@angular/forms": "~2.1.1",\n' +
      '    "@angular/http": "~2.1.1",\n' +
      '    "@angular/platform-browser": "~2.1.1",\n' +
      '    "@angular/platform-browser-dynamic": "~2.1.1",\n' +
      '    "@angular/router": "~3.1.1",\n' +
      '    "es6-shim": "^0.35.0",\n' +
      '    "nativescript-angular": "next",\n' +
      '    "nativescript-ng2-magic": "1.8.0",\n' +
      '    "reflect-metadata": "0.1.8",\n' +
      '    "rxjs": "5.0.0-beta.12",\n' +
      '    "tns-core-modules": "^2.3.0"\n' +
      '  },\n' +
      '  "devDependencies": {\n' +
      '    "@types/jasmine": "^2.5.35",\n' +
      '    "babel-traverse": "6.12.0",\n' +
      '    "babel-types": "6.11.0",\n' +
      '    "babylon": "6.8.4",\n' +
      '    "filewalker": "0.1.2",\n' +
      '    "lazy": "1.0.11",\n' +
      '    "nativescript-dev-typescript": "^0.3.2",\n' +
      '    "typescript": "^2.0.2",\n' +
      '    "zone.js": "^0.6.21"\n' +
      '  }\n' +
      '}';

    fs.writeFile(packagePath, fix, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
};

var startFixes = function () {
  fs.unlink('nativescript/app/app.component.ts', function () {
    fixTsConfig();
  });
};

startFixes();


// global helpers
function copyFileSync(source, target) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

