import {MagicDecoratorUtils} from './utils';

export function Component(metadata: any = {}) {
  return function(cls: any) {
    return MagicDecoratorUtils.annotateComponent(cls, metadata);
  };
}
