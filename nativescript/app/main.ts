// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap} from "nativescript-angular/application";
import {NS_ROUTER_PROVIDERS} from "nativescript-angular/router";

// import your root component here
import {AppComponent} from "./client/components/app.component";

nativeScriptBootstrap(AppComponent, [NS_ROUTER_PROVIDERS]);
