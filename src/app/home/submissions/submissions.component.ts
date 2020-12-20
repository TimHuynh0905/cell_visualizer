import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import firebase from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserModel } from 'src/app/shared/user.model';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
  userDetails: UserModel = null;

  sampleJsonTitles: string[] = [];
  sampleJsonLocations: string[] = [];

  userJsonTitles: string[] = [];
  userJsonObjects: {
    downloadUrl: string,
    fullPath: string,
    name: string
  }[] = [];

  constructor(private authService: AuthService,
              private firestore: AngularFirestore) { }

  ngOnInit() {
    this.authService.userDetailsChanged.subscribe(
      (newUserDetails: UserModel) => {
        this.userDetails = newUserDetails;
        console.log(this.userDetails);
        this.fetchUserJson();
      }
    );
    this.fetchSampleJson();
  }

  async fetchUserJson() {
    if (!this.userDetails) return;
    const userFilesDocRef = await this.firestore.doc(`json_files/${this.userDetails.id}`).get();
    userFilesDocRef.subscribe(
      (async snapShot => {
          console.log(snapShot.data());
          Object.entries(snapShot.data()).forEach(
            (entry,_) => {
              this.userJsonObjects = entry[1];
              console.log(this.userJsonObjects);
              this.userJsonTitles = this.userJsonObjects.map(obj => obj.name);
            }
          );          
        }
      )
    );
  }

  async fetchSampleJson() {
    const sampleFilesDocRef = await this.firestore.doc('json_files/samples').get();
    sampleFilesDocRef.subscribe(
      (async snapShot => {
          console.log(snapShot.data());
          Object.entries(snapShot.data()).forEach(
            (entry,_) => {
              this.sampleJsonLocations = entry[1];
              this.sampleJsonTitles = this.sampleJsonLocations.map(
                (location: string) => location.split('/').pop()
              );
            }
          );          
        }
      )
    );
  }
}
