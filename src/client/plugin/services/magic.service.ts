import {ROUTER_DIRECTIVES} from '@angular/router';
import {ROUTER_DIRECTIVES as DEP_ROUTER_DIRECTIVES} from '@angular/router-deprecated';

declare var NSObject, NSString, android, java;

export class MagicService {
  public static ROUTER_DIRECTIVES: any = ROUTER_DIRECTIVES;
  public static DEP_ROUTER_DIRECTIVES: any = DEP_ROUTER_DIRECTIVES;

  public static TEMPLATE_URL(path: string): string {
    if (MagicService.IS_NATIVESCRIPT()) {
      let paths = path.split('.');
      paths.splice(-1);
      return `${paths.join('.')}.tns.html`;
    } else {
      return path;
    }
  }

  public static IS_NATIVESCRIPT() {
    return ((typeof NSObject !== 'undefined' && typeof NSString !== 'undefined') || (typeof android !== 'undefined' && typeof java !== 'undefined'));
  }
}
