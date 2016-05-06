// angular
import {Component} from '@angular/core';

// app
import {MagicService} from '../services/magic.service';

declare var Reflect: any;
const _reflect: any = Reflect;

export class MagicDecoratorUtils {
  public static getMetadata(metadata: any = {}, customDecoratorMetadata?: any) {

    if (metadata.templateUrl) {
      // correct view for platform target
      metadata.templateUrl = MagicService.TEMPLATE_URL(metadata.templateUrl);
    }

    return metadata;
  }

  public static annotateComponent(cls: any, metadata: any = {}, customDecoratorMetadata?: any) {
    let annotations = _reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Component(MagicDecoratorUtils.getMetadata(metadata, customDecoratorMetadata)));
    _reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}
