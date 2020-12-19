import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import firebase from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
  isAuthenticated: boolean = false;
  sampleJsonTitles: string[] = [];
  sampleJsonLocations: string[] = [];

  constructor(private authService: AuthService,
              private fireStorage: AngularFireStorage,
              private firestore: AngularFirestore) { }

  ngOnInit() {
    this.authService.user.subscribe(
      (userAuth: firebase.User) => {
        // console.log(userAuth);
        this.isAuthenticated = userAuth ? true : false;
    });

    this.fetchJsonTitles();
  }

  async fetchJsonTitles() {
    this.firestore.collection('json_files').valueChanges().subscribe(
      (jsonFilesCollection: [
        {
          samples: string[],
          user_generated: string[],
        }
      ]) => {
        this.sampleJsonLocations = jsonFilesCollection[0].samples;
        this.sampleJsonTitles = this.sampleJsonLocations.map(
          (location: string) => location.split('/').pop()
        );
      }
    );   
  }

}
