import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.subscribe(
      (userAuth: firebase.User) => {
        // console.log(userAuth);
        this.isAuthenticated = userAuth ? true : false;
    });
  }

  signout() {
    this.authService.signout();
  }
}
