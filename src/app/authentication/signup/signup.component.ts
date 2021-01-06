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

  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  async signup() {
    if (this.passwordInput === this.confirmPasswordInput) {
      this.isLoading = true;
      this.authService.register(
        this.usernameInput,
        this.emailInput,
        this.passwordInput
      );
      this.isLoading = false;
    }
  } 
}
