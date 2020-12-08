import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CellComponent } from './cell/cell.component';
import { ColorDirective } from './cell/color.directive';
import { CellService } from './cell/cell.service';
import { SelectionComponent } from './selection/selection.component';
import { LegendComponent } from './legend/legend.component';
import { DescriptionsComponent } from './descriptions/descriptions.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { SubmissionComponent } from './submissions/submission/submission.component';

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    ColorDirective,
    SelectionComponent,
    LegendComponent,
    DescriptionsComponent,
    NavbarComponent,
    SubmissionsComponent,
    SubmissionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [CellService],
  bootstrap: [AppComponent]
})
export class AppModule { }
