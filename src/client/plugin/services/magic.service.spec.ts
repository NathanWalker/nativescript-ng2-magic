import {
  it,
  describe,
  expect,
  async,
  inject,
  beforeEach,
  beforeEachProviders
} from 'angular2/testing';
import {MagicService} from './magic.service';

let win:any = window || {};
// mock a {N} env
win.NSObject = {};
win.NSString = "test";

describe('MagicService', () => {

  beforeEach(() => {
    spyOn(console, 'error');
  });
  
  it('should provide resilient magic', () => {
    expect(MagicService.NATIVESCRIPT_VIEW_PATH).toBeUndefined();
    expect(MagicService.IS_NATIVESCRIPT()).toBe(true);
    expect(MagicService.IS_IOS()).toBe(true);
    expect(MagicService.IS_ANDROID()).toBe(false);
    expect(MagicService.TEMPLATE_URL('./components/test.html')).toBe('./components/test.ios.html');
    expect(MagicService.STYLE_URLS('./components/test.css')).toBe('./components/test.ios.css');
    expect(console.error).toHaveBeenCalledWith(`You need to set 'MagicService.NATIVESCRIPT_VIEW_PATH' to the path of your NativeScript views.`);
    expect(MagicService.TEMPLATE_URL)
  });

  it('should provide real magic', () => {
    MagicService.NATIVESCRIPT_VIEW_PATH = './nativescript';
    expect(MagicService.TEMPLATE_URL('./components/test.html')).toBe('./nativescript/components/test.html');
  });

});
