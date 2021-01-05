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
import { FirebaseModule } from './firebase.module';
import { AuthService } from './authentication/auth.service';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    // LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ComponentsModule,
    DirectivesModule,
    FirebaseModule
  ],
  providers: [ 
    AuthService, 
    CellService 
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
