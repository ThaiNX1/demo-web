import { NgModule } from '@angular/core';
import { AutofocusDirective } from './autofocus.directive';
import { IsTemplateDirective } from './is-template.directive';
import { UpperCaseInputDirective } from './uppercase-input.directive';

@NgModule({
    declarations: [IsTemplateDirective, AutofocusDirective, UpperCaseInputDirective],
    providers: [IsTemplateDirective, AutofocusDirective, UpperCaseInputDirective],
    exports: [IsTemplateDirective, AutofocusDirective, UpperCaseInputDirective],
})
export class DirectivesModule {}
