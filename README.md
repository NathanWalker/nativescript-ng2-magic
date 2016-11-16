[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://github.com/mgechev/angular2-style-guide)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/preboot/angular2-library-seed/status.svg)](https://david-dm.org/preboot/angular2-library-seed#info=dependencies) [![devDependency Status](https://david-dm.org/preboot/angular2-library-seed/dev-status.svg)](https://david-dm.org/preboot/angular2-webpack#info=devDependencies)

![nativescript-ng2-magic](https://cdn.filestackcontent.com/XXMT4f8S8OGngNsJj0pr?v=0)

Magically drop a [NativeScript](https://www.nativescript.org/) app into your existing [Angular2](https://angular.io/) web application and reuse all your code.*

*You will be adding NativeScript views, but you already knew that.*

* [Supported projects that can use magic](#supported-projects)
* [Watch video on how to integrate with Angular CLI](http://www.nativescriptsnacks.com/videos/2016/05/12/magic-scaffolding.html)

## Install

```
npm i nativescript-ng2-magic --save
```

## Usage

1. Use `Component` from `nativescript-ng2-magic` instead of `@angular/core`. [Why?](#why-different-component)
2. Create NativeScript views ending with `.tns.html` (and/or styles ending with `.tns.css`) for each of your component's. [How?](#how-to-create-nativescript-views)
3. [Run your truly *native* mobile app with NativeScript!](#run-for-first-time)

## Example

A sample root component, **app.component.ts**:

```
import {Component} from 'nativescript-ng2-magic';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent {}
```

### Run for first time!

You will need to have fully completed steps 1 and 2 above.

Run your app in the iOS Simulator with:

```
npm run start.ios
```

Run your app in an Android emulator with:

```
npm run start.android
```

Welcome to the wonderfully magical world of NativeScript!

## How to create NativeScript views

Based on our example above, assume `app.component.html` looks like this:

```
<main>
  <div>This is my root component</div>
</main>
```

You would then create a new file in `app.component.tns.html` like this:

```
<StackLayout>
  <Label text="This is my root component"></Label>
</StackLayout>
```

You can **also** use platform specific views if desired with the `platformSpecific` Component metadata:

```
import {Component} from 'nativescript-ng2-magic';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  platformSpecific: true
})
export class AppComponent {}
```

Then you could create separate views for iOS and Android:

* `app.component.ios.html`
* `app.component.android.html`

You can [learn more about NativeScript view options here](https://docs.nativescript.org/ui/ui-views).

You can also install helpful view snippets for [VS Code here](https://marketplace.visualstudio.com/items?itemName=wwwalkerrun.nativescript-ng2-snippets) or [Atom Editor here](https://atom.io/packages/nativescript-ng2-atom-snippets).

You can [learn more here](http://angularjs.blogspot.com/2016/03/code-reuse-in-angular-2-native-mobile.html?m=1) about how this setup works and why.

## Supported Projects

* [angular-cli](https://cli.angular.io/)
* [angular2-seed](https://github.com/angular/angular2-seed)
* [angular2-webpack-seed](https://github.com/NathanWalker/angular2-webpack-seed)

### Why different Component?

`Component` from `nativescript-ng2-magic` is identical to `Component` from `@angular/core`, except it automatically uses NativeScript views when your app runs in a NativeScript mobile app.

The library provides a custom `Decorator` under the hood.
Feel free to [check it out here](https://github.com/NathanWalker/nativescript-ng2-magic/blob/master/src/client/plugin/decorators/magic.component.ts) and it uses a [utility here](https://github.com/NathanWalker/nativescript-ng2-magic/blob/master/src/client/plugin/decorators/utils.ts).

You can see more elaborate use cases of this magic with [angular2-seed-advanced](https://github.com/NathanWalker/angular2-seed-advanced).

### Special Note About AoT

Currently you cannot use custom component decorators with AoT compilation. This may change in the future but for now you can use this pattern for when you need to create AoT builds for the web:

```
import { Component } from '@angular/core';

// just comment this out and use Component from 'angular/core'
// import { Component } from 'nativescript-ng2-magic';

@Component({
  // etc.
```

After doing the above, running AoT build will succeed. :)

The Component from `nativescript-ng2-magic` does the auto `templateUrl` switching to use {N} views when running in the {N} app therefore you don't need it when creating AoT builds for the web. However just note that when going back to run your {N} app, you should comment back in the `Component` from `nativescript-ng2-magic`. Again this temporary inconvenience may be unnecessary in the future.

## Requirements

* [Install NativeScript](http://docs.nativescript.org/start/getting-started#install-nativescript-and-configure-your-environment)

# License

[MIT](/LICENSE)
