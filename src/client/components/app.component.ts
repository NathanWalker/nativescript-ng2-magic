import {Component} from '../plugin/decorators/magic.component';
import {MagicService} from '../plugin/services/magic.service';
MagicService.NATIVESCRIPT_VIEW_PATH = './client/nativescript';

// UNCOMMENT BELOW to test NativeScript Mock Env
// let win: any = window || {};
// // mock a {N} env
// win.NSObject = {};
// win.NSString = "test";

/*
 * Library Demo
 */
@Component({
  selector: 'app',
  styleUrls: ['./client/components/app.component.css'],
  templateUrl: './client/components/app.component.html'
})
export class AppComponent {
  statement: string = 'Creating magic with NativeScript + Angular2';
  url: string = 'https://github.com/NathanWalker/nativescript-ng2-magic';
}
