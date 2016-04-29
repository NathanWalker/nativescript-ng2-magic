[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://github.com/mgechev/angular2-style-guide)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/preboot/angular2-library-seed/status.svg)](https://david-dm.org/preboot/angular2-library-seed#info=dependencies) [![devDependency Status](https://david-dm.org/preboot/angular2-library-seed/dev-status.svg)](https://david-dm.org/preboot/angular2-webpack#info=devDependencies)

![nativescript-ng2-magic](https://cdn.filestackcontent.com/XXMT4f8S8OGngNsJj0pr?v=0)

Magically integrate your [Angular2](https://angular.io/) web app with [NativeScript](https://www.nativescript.org/).

## Install

```
sudo npm i nativescript-ng2-magic
```

*Note: May require a password. 1 global npm package is installed.*

## Usage

1. Use `Component` from `nativescript-ng2-magic` instead of `angular2/core`. [Why?](#why-different-component)
2. Use `templateUrl` with your components and use absolute paths. [Why?](#why-absolute-paths)
3. Point `MagicService.NATIVESCRIPT_VIEW_PATH` at a specific directory for your NativeScript views.
4. Create NativeScript views for each of your component's templates in that ^ directory. [Learn more](http://angularjs.blogspot.com/2016/03/code-reuse-in-angular-2-native-mobile.html?m=1)
5. Add npm script to run your NativeScript app. [View example here](#npm-script)
6. [Run your truly *native* mobile app with NativeScript!](#run-for-first-time)

### Example

**app.component.ts**:

```
import {Component, MagicService} from 'nativescript-ng2-magic';
MagicService.NATIVESCRIPT_VIEW_PATH = './client/nativescript'; // can be any directory in your project

@Component({
  selector: 'app',
  templateUrl: './client/components/app.component.html'
})
export class AppComponent {}
```

**Web Bootstrap**:

```
import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './client/components/app.component';

bootstrap(AppComponent);
```

**NativeScript Bootstrap**:

```
import {nativeScriptBootstrap} from 'nativescript-angular/application';
import {AppComponent} from './client/components/app.component';

nativeScriptBootstrap(AppComponent)
```

### npm script 

Your `prepareapp` script should simply copy your web app src to the `nativescript/app` folder. [Why?](#why-copy-web-src)

The web app src available in this repo provides a directory structure that works well for this. [This seed project](https://github.com/NathanWalker/angular2-webpack-seed) also provides a good working directory structure that is much like the one found here.
Example `scripts` from `package.json`:

```
...
  "scripts": {
    "prepareapp": "cp -R src/client nativescript/app/",
    "start.ios": "npm run prepareapp && cd nativescript && tns emulate ios",
    "start.android": "npm run prepareapp && cd nativescript && tns emulate android"
  }
...
```

### Run for first time!

You will need to have fully completed steps 1-5 above.

```
npm run prepareapp
```

Now open `nativescript/app/main.ts` and set it up to import your main/root component. Once modified, it should look a little something like this:

```
// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap} from "nativescript-angular/application";
import {AppComponent} from "./client/components/app.component";

nativeScriptBootstrap(AppComponent);
```

You can safely delete `nativescript/app/app.component.ts` since that was just a sample.

```
npm run start.ios  // or npm run start.android
```

Welcome to the wonderfully magical world of NativeScript!

#### Why copy the web src?

This is the quickest way to get your web app running in a NativeScript application.
Your project can take the next steps to create customized builds using webpack, grunt, or gulp to further evolve your project needs and development workflows to relieve the need of copying the web src as needed.

### Why different Component?

`Component` from `nativescript-ng2-magic` is identical to `Component` from `angular2/core`, except it automatically uses NativeScript views when your app runs in a NativeScript mobile app.

The library provides a custom `Decorator` under the hood.
Feel free to [check it out here](https://github.com/NathanWalker/nativescript-ng2-magic/blob/master/src/client/plugin/decorators/magic.component.ts) and it uses a [utility here](https://github.com/NathanWalker/nativescript-ng2-magic/blob/master/src/client/plugin/decorators/utils.ts).

You can see more elaborate use cases of this magic with [angular2-seed-advanced](https://github.com/NathanWalker/angular2-seed-advanced).

### Why absolute paths?

Relative paths won't work because the view path translation expands your component's templateUrl underneath the `NATIVESCRIPT_VIEW_PATH` you configure. It needs a full path to your components template to achieve it's magic.

## Requirements

* [Install NativeScript](http://docs.nativescript.org/start/getting-started#install-nativescript-and-configure-your-environment)
* Requires usage of `templateUrl` for your `Component`'s using absolute paths. 

# License

[MIT](/LICENSE)
