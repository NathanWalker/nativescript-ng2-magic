declare var NSObject, NSString, android, java;

export class MagicService {

  public static TEMPLATE_URL(path: string): string {
    if (MagicService.IS_NATIVESCRIPT()) {
      path = path.replace("./", "./app/");
      var paths = path.split('.');
      paths.splice(-1);
      return paths.join('.') + ".tns.html";
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
        return `${parts.join('.')}.tns.css`;
      });
    } else {
      return paths;
    }
  }

  public static IS_NATIVESCRIPT() {
    return ((typeof NSObject !== 'undefined' && typeof NSString !== 'undefined') || (typeof android !== 'undefined' && typeof java !== 'undefined'));
  }
}
