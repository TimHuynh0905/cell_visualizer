import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CellComponent } from './cell/cell.component';
import { ColorDirective } from './cell/color.directive';
import { CellService } from './cell/cell.service';
import { SelectionComponent } from './selection/selection.component';

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    ColorDirective,
    SelectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [CellService],
  bootstrap: [AppComponent]
})
export class AppModule { }
