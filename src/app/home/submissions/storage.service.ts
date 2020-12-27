import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  userFilesDocument: AngularFirestoreDocument<unknown>;
  userFilesDocRef: Observable<firebase.firestore.DocumentSnapshot<unknown>>;
  
  private userJsonObjects: {
    downloadUrl: string,
    fullPath: string,
    name: string
  }[] = [];

  userJsonObjectsChanged = new EventEmitter<{
    downloadUrl: string,
    fullPath: string,
    name: string
  }[]>();

  constructor() {}

  fetchUserJson() {
    this.userFilesDocRef.subscribe(
      (snapShot => {
        if (snapShot.data() != null) {
          console.log(Object.entries(snapShot.data())[0][1]);
          this.userJsonObjects = Object.entries(snapShot.data())[0][1];
          this.userJsonObjectsChanged.emit(this.userJsonObjects);
        }      
      })
    );
  }

  addNewUserFile(newObject: {
    downloadUrl: string,
    fullPath: string,
    name: string
  }) {
    this.userJsonObjects.unshift(newObject);
    this.userJsonObjectsChanged.emit(this.userJsonObjects);
  }
}
