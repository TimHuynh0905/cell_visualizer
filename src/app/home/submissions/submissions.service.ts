import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionsService {
  userFilesDocument: AngularFirestoreDocument<unknown>;
  userFilesDocRef: Observable<firebase.firestore.DocumentSnapshot<unknown>>;
  
  private userJsonTitles: string[] = [];
  private userJsonObjects: {
    downloadUrl: string,
    fullPath: string,
    name: string
  }[] = [];

  userJsonTitlesChanged = new EventEmitter<string[]>();
  userJsonObjectsChanged = new EventEmitter<{
    downloadUrl: string,
    fullPath: string,
    name: string
  }[]>();

  constructor() {}

  fetchUserJson() {
    this.userFilesDocRef.subscribe(
      (snapShot => {
          console.log(snapShot.data());
          Object.entries(snapShot.data()).forEach(
            (entry,_) => {
              this.userJsonObjects = entry[1];
              this.userJsonTitles = this.userJsonObjects.map(obj => obj.name);

              this.userJsonTitlesChanged.emit(this.userJsonTitles);
              this.userJsonObjectsChanged.emit(this.userJsonObjects);
            }
          );          
        }
      )
    );
  }

  addNewUserFile(newObject: {
    downloadUrl: string,
    fullPath: string,
    name: string
  }) {
    this.userJsonObjects.unshift(newObject);
    this.userJsonTitles.unshift(newObject.name);

    this.userJsonTitlesChanged.emit(this.userJsonTitles);
    this.userJsonObjectsChanged.emit(this.userJsonObjects);
  }
}
