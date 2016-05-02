// -----------------------------------------------------------
// version 1.05
// -----------------------------------------------------------
"use strict";

var fs = require('fs');
var cp = require('child_process');
var path = require('path');

// Root SymLink Code for Windows
if (process.argv.length > 2) {
    if (process.argv[2] === 'symlink') {
        createRootSymLink();
        console.log("Created Symlink");
    }
    return 0;
}

var isRanFromNativeScript = fs.existsSync("../../app/App_Resources");
var hasNativeScript = fs.existsSync("../../nativescript");

if (!hasNativeScript && !isRanFromNativeScript) {
    console.log("Installing NativeScript Angular 2 Template...");
    cp.execSync('tns create nativescript --template  https://github.com/NativeScript/template-hello-world-ng', {cwd: '../..'});
    console.log("Installing NativeScript support files...");
    cp.execSync('npm install', {cwd: '../../nativescript'});

    console.log("Installing support files");
    if (process.platform === 'darwin') {
        cp.execSync('npm install sudo-fn', {cwd: '../..'});
    }
    cp.execSync('npm install image-to-ascii-cli', {cwd: '../..'});

    console.log("Configuring...");
    cp.execSync('tns plugin add nativescript-ng2-magic', {cwd: '../../nativescript'});

    // We need to create a symlink
    try {
        createSymLink();
    } catch (err) {
        console.log(err);
        // Failed, which means they weren't running root; so lets try to get root
        AttemptRootSymlink();
    }
    // Might silent fail on OSX, so we have to see if it exists
    if (!fs.existsSync('../../nativescript/app/client')) {
        AttemptRootSymlink();
    }


    // image to ascii used GM/ImageMagick which may not be installed, so if it isn't installed; don't print the error message
    var ascii = cp.execSync('image-to-ascii -i https://cdn.filestackcontent.com/XXMT4f8S8OGngNsJj0pr', {cwd: '../image-to-ascii-cli/bin/'}).toString();
    if (ascii.length > 30) {
        console.log(ascii);
    }

    displayFinalHelp();

}

if (isRanFromNativeScript) {
    if (!fs.existsSync('installed.ns') ) {
        fs.writeFileSync('installed.ns', 'installed');
        fixTsConfig();
        fixNativeScriptPackage();
        fixAngularPackage();
        fixMainFile(figureOutRootComponent());
        console.log("Completed Install");
    } else {
        console.log("We have already been installed in the NS as a plugin");
        return 0;
    }
}

return 0;

/**
 * Searches for the bootstrap file until it finds one....
 * @returns {string}
 */
function figureOutRootComponent() {
    var rootComponents = ['../../../src/bootstrap.ts', '../../../boot.ts'];
    for (var i=0;i<rootComponents.length; i++) {
        if (fs.existsSync(rootComponents[i])) {
            var result = processBootStrap(rootComponents[i]);
            if (result) { return result; }
        }
    }
    // Return a default component, if we can't find one...
    return './client/components/app.component';
}

/**
 * Parses the bootstrap to figure out the default bootstrap component
 * @param file
 * @returns {*}
 */
function processBootStrap(file) {
    var data = fs.readFileSync(file).toString();
    var idx = data.indexOf('bootstrap(');
    if (idx === -1) { return null; }
    else { idx+=10; }

    var odx1 = data.indexOf(',', idx);
    var odx2 = data.indexOf(')', idx);
    if (odx2 < odx1 && odx2 !== -1 || odx1 === -1) { odx1 = odx2; }
    if (odx1 === -1) { return null; }
    var componentRef = data.substring(idx, odx1);
    var exp = "import\\s+\\{"+componentRef+"\\}\\s+from\\s+[\'|\"](\\S+)[\'|\"][;?]";
    //noinspection JSPotentiallyInvalidConstructorUsage
    var r = RegExp(exp, 'i').exec(data);
    if (r === null || r.length <= 1) { return null; }
    return r[1];
}

/**
 * This will attempt to run the install script as root to make a symlink
 *
 */
function AttemptRootSymlink() {

    if (process.platform === 'win32') {
        var curPath = path.resolve("../../nativescript/node_modules/nativescript-ng2-magic");
        cp.execSync("powershell -Command \"Start-Process 'node' -ArgumentList '"+curPath+"/install.js symlink' -verb runas\"");
    } else if (process.platform === 'darwin') {
        var sudoFn = require('sudo-fn');
        sudoFn({module: 'fs', function: 'symlinkSync', params: [path.resolve('../../src/client/'),path.resolve('../../nativescript/app/client')],type: 'node-callback'},function () {
            console.log("Symlink Created");
        });
    }
}

/**
 * Create the symlink when running as root
 */
function createRootSymLink() {
    var li1 = process.argv[1].lastIndexOf('\\'), li2 = process.argv[1].lastIndexOf('/');
    if (li2 > li1) { li1 = li2; }
    var AppPath = process.argv[1].substring(0,li1);
    var p1 = path.resolve(AppPath+'/../../app/client');
    var p2 = path.resolve(AppPath+'/../../../src/client/');
    fs.symlinkSync(p2,p1,'junction');
}

/**
 * Create Symlink
 */
function createSymLink() {
    fs.symlinkSync(path.resolve('../../src/client/'),path.resolve('../../nativescript/app/client'),'junction');
}

/**
 * This fixes the TS Config file in the nativescript folder
 */
function fixTsConfig() {
    var tsConfig={}, tsFile = '../../tsconfig.json';
    if (fs.existsSync(tsFile)) {
        tsConfig = require(tsFile);
    }
    if (!tsConfig.compilerOptions) {
        tsConfig.compilerOptions = {
            module: 'commonjs',
            target: 'es5',
            sourceMap:true,
            experimentalDecorators: true,
            emitDecoratorMetadata: true};
    }

    // See: https://github.com/NativeScript/nativescript-angular/issues/205
    tsConfig.compilerOptions.noEmitHelpers = false;
    tsConfig.compilerOptions.noEmitOnError = false;

    if (!tsConfig.exclude) {
        tsConfig.exclude = [];
    }
    if (tsConfig.exclude.indexOf('node_modules') === -1) {
        tsConfig.exclude.push('node_modules');
    }
    if (tsConfig.exclude.indexOf('platforms') === -1) {
        tsConfig.exclude.push('platforms');
    }

    fs.writeFileSync(tsFile, JSON.stringify(tsConfig, null, 4), 'utf8');
}

/**
 * Fix the NativeScript Package file
 */
function fixNativeScriptPackage() {
    var packageJSON={}, packageFile = '../../package.json';
    var AngularJSON = {};
    if (fs.existsSync(packageFile)) {
        packageJSON = require(packageFile);
    } else {
        console.log("This should not happen, your are missing your package.json file!");
        return;
    }
    if (fs.existsSync('../angular2/package.json')) {
        AngularJSON = require('../angular2/package.json');
    } else {
        // Copied from the Angular2.0.0-beta-16 package.json, this is a fall back
        AngularJSON.peerDependencies = {
            "es6-shim": "^0.35.0",
            "reflect-metadata": "0.1.2",
            "rxjs": "5.0.0-beta.2",
            "zone.js": "^0.6.12"
        };
    }

    // Setup the TNS Version
    var version = packageJSON.dependencies['tns-core-modules'];
    if (version[0] === '^') { version = version.substring(1); }
    if (version.indexOf(' ') !== -1) {
        version = version.substring(0, version.indexOf(' '));
    }
    packageJSON.nativescript['tns-ios'] = {version: version};
    packageJSON.nativescript['tns-android'] = {version: version};

    // Copy over all the Peer Dependencies
    for (var key in AngularJSON.peerDependencies) {
        if (AngularJSON.peerDependencies.hasOwnProperty(key)) {
            packageJSON.dependencies[key] = AngularJSON.peerDependencies[key];
        }
    }


    // TODO: Can we get these from somewhere rather than hardcoding them, maybe need to pull/download the package.json from the default template?
    if (!packageJSON.devDependencies) {
        packageJSON.devDependencies = {};
    }
    packageJSON.devDependencies["babel-traverse"] = "6.7.6";
    packageJSON.devDependencies["babel-types"] = "6.7.7";
    packageJSON.devDependencies.babylon = "6.7.0";
    packageJSON.devDependencies.filewalker = "0.1.2";
    packageJSON.devDependencies.lazy = "1.0.11";
    packageJSON.devDependencies["nativescript-dev-typescript"] = "^0.3.2";
    packageJSON.devDependencies.typescript = "^1.8.10";

    fs.writeFileSync(packageFile, JSON.stringify(packageJSON, null, 4), 'utf8');
}

/**
 * Fix the Angular Package
 */
function fixAngularPackage() {
    var packageJSON = {}, packageFile = '../../../package.json';
    if (fs.existsSync(packageFile)) {
        packageJSON = require(packageFile);
    } else {
        console.log("This should not happen, your are missing your main package.json file!");
        return;
    }

    if (!packageJSON.scripts) {
        packageJSON.scripts = {};
    }
    if (process.platform === "win32") {
        packageJSON.scripts["start.ios"] = "cd nativescript && tns emulator ios && cd ..";
        packageJSON.scripts["start.android"] = "cd nativescript && tns emulator android && cd ..";
    } else {
        packageJSON.scripts["start.ios"] = "cd nativescript; tns emulator ios; cd ..";
        packageJSON.scripts["start.android"] = "cd nativescript; tns emulator android; cd ..";
    }

    fs.writeFileSync(packageFile, JSON.stringify(packageJSON, null, 4), 'utf8');
}

/**
 * Fix the Main NativeScript File
 * @param component
 */
function fixMainFile (component) {
    var mainPath = '../../app/main.ts';

    var fix = '// this import should be first in order to load some required settings (like globals and reflect-metadata)\n' +
        'import {nativeScriptBootstrap} from "nativescript-angular/application";\n' +
        'import {NS_ROUTER_PROVIDERS, NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";\n' +
        'import {MagicService} from "nativescript-ng2-magic";\n' +
        'MagicService.ROUTER_DIRECTIVES = NS_ROUTER_DIRECTIVES;\n' +
        '\n' +
        '// import your root component here\n' +
        'import {AppComponent} from "' + component + '";\n' +
        '\n' +
        'nativeScriptBootstrap(AppComponent, [NS_ROUTER_PROVIDERS], { startPageActionBarHidden: false });';


    fs.writeFileSync(mainPath, fix, 'utf8');
}

/**
 * Display final help screen!
 */
function displayFinalHelp()
{
    console.log("");
    console.log("------------------------------------------------------------------------------");
    console.log("You may need to configure your root component for your NativeScript App.");
    console.log("Follow this guide https://github.com/NathanWalker/nativescript-ng2-magic#usage");
    console.log("");
    console.log("Run your app in the iOS Simulator with:");
    console.log("  npm run start.ios");
    console.log("");
    console.log("Run your app in an Android emulator with:");
    console.log("  npm run start.android");
    console.log("------------------------------------------------------------------------------s");
    console.log("");
}