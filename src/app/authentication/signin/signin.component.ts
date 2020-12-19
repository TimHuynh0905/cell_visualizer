import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit{
  emailInput: string = '';
  passwordInput: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  signin() {
    this.authService.signin(this.emailInput, this.passwordInput);
  }
  
  cancel() {
    // console.log(this.authService.user);
  }

}
