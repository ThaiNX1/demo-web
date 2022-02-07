import { Pipe, PipeTransform } from '@angular/core';
import { LanguageTypeEnum } from 'src/app/enums/language-type.enum';

@Pipe({
  name: 'moneytype',
})
export class MoneyTypePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    switch (Number(value)) {
      case Number(LanguageTypeEnum.VIETNAM):
        return 'vnđ';
      case Number(LanguageTypeEnum.KOREA):
        return 'won';
      case Number(LanguageTypeEnum.ENGLISH):
        return '$';
      default:
        return 'vnđ';
    }
  }
}
