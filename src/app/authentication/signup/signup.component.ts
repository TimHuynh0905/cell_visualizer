import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  usernameInput: string = '';
  emailInput: string = '';
  passwordInput: string = '';
  confirmPasswordInput: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  signup() {
    if (this.passwordInput === this.confirmPasswordInput) {
      this.authService.register(
        this.emailInput,
        this.passwordInput)
    }
  } 
}
