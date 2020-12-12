import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DirectivesModule } from './directives.module';

import { CellComponent } from './home/cell/cell.component';
import { SelectionComponent } from './home/selection/selection.component';
import { LegendComponent } from './home/legend/legend.component';
import { DescriptionsComponent } from './home/descriptions/descriptions.component';
import { SubmissionsComponent } from './home/submissions/submissions.component';
import { SubmissionComponent } from './home/submissions/submission/submission.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';

export const COMPONENTS = [
    CellComponent,
    SelectionComponent,
    LegendComponent,
    DescriptionsComponent,
    SubmissionsComponent,
    SubmissionComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class ComponentsModule { }