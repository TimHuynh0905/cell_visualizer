import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components.module';
import { DirectivesModule } from './directives.module';

import { CellService } from './home/cell/cell.service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ComponentsModule,
    DirectivesModule
  ],
  providers: [ CellService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
