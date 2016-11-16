import {Component} from '../plugin/decorators/magic.component';
import {MagicService} from '../plugin/services/magic.service';

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
  templateUrl: './client/components/app.component.html',
  platformSpecific: true
})
export class AppComponent {
  statement: string = 'Creating magic with NativeScript + Angular2';
  url: string = 'https://github.com/NathanWalker/nativescript-ng2-magic';
}
