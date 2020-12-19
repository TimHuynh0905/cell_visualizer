import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { HomeComponent } from './home/home.component';

const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);

const appRoutes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
  },
  { 
    path: 'signin', 
    component: SigninComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  { 
    path: 'signup', 
    component: SignupComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
