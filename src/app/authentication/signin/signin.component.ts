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
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  async signin() {
    this.isLoading = true;
    await this.authService.signin(this.emailInput, this.passwordInput);
    this.isLoading = false;
  }
  
  cancel() {
    // console.log(this.authService.user);
  }

}
