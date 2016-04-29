declare var NSObject, NSString, android, java;

export class MagicService {
  public static NATIVESCRIPT_VIEW_PATH: string;

  public static TEMPLATE_URL(path: string): string {
    if (MagicService.IS_NATIVESCRIPT()) {
      if (!MagicService.NATIVESCRIPT_VIEW_PATH) {
        console.error(`You need to set 'MagicService.NATIVESCRIPT_VIEW_PATH' to the path of your NativeScript views.`);
        return path;
      }
      path = path.slice(1); // remove leading '.'
      // return `./frameworks/nativescript.framework${path}`; 
      return `${MagicService.NATIVESCRIPT_VIEW_PATH}${path}`;
    } else {
      return path;
    }
  }

  public static IS_NATIVESCRIPT() {
    return ((typeof NSObject !== 'undefined' && typeof NSString !== 'undefined') || (typeof android !== 'undefined' && typeof java !== 'undefined'));
  }
}
