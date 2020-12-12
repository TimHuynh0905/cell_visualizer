import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorDirective } from './home/cell/color.directive';

export const DIRECTIVES = [
    ColorDirective
];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: DIRECTIVES,
    exports: DIRECTIVES,
})
export class DirectivesModule { }