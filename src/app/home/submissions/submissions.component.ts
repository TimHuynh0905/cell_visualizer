import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(
      (userAuth: firebase.User) => {
        console.log(userAuth);
        this.isAuthenticated = userAuth ? true : false;
    });
  }

}
