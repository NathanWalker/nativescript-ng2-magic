declare var NSObject, NSString, android, java;

export class MagicService {

  public static TEMPLATE_URL(path: string): string {
    if (MagicService.IS_NATIVESCRIPT()) {
      path = path.replace("./", "./app/");
      var paths = path.split('.');
      paths.splice(-1);
      var platform = MagicService.IS_ANDROID() ? 'android' : 'ios';
      return `${paths.join('.')}.${platform}.html`;
    } else {
      return path;
    }
  }

  public static STYLE_URLS(paths: string[]): string[] {
    if (MagicService.IS_NATIVESCRIPT()) {
      return paths.map((path) => {
        path = path.replace("./", "./app/");
        let parts = path.split('.');
        parts.splice(-1);
        var platform = MagicService.IS_IOS() ? 'ios' : 'android';
        return `${parts.join('.')}.${platform}.css`;
      });
    } else {
      return paths;
    }
  }

  public static IS_NATIVESCRIPT() {
    return (MagicService.IS_IOS() || MagicService.IS_ANDROID());
  }

  public static IS_IOS() {
    return (typeof NSObject !== 'undefined' && typeof NSString !== 'undefined');
  }

  public static IS_ANDROID() {
    return (typeof android !== 'undefined' && typeof java !== 'undefined');
  }
}
