import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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
import { SignupComponent } from './authentication/signup/signup.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
];

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
    SubmissionComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [CellService],
  bootstrap: [AppComponent]
})
export class AppModule { }
