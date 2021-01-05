import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserModel } from 'src/app/shared/models/user.model';
import { StorageService } from './storage.service';
import { CellService } from '../cell/cell.service';
import { JsonValueModel } from 'src/app/shared/models/json.model';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
  providers: [ StorageService ],
})
export class SubmissionsComponent implements OnInit {
  userDetails: UserModel = null;
  isLoading: boolean = false;

  userJsonTitles: string[] = [];
  userJsonObjects: {
    downloadUrl: string,
    fullPath: string,
    name: string
  }[] = [];

  selectedTitle: string = '';
  newSelectedJsonFile: JsonValueModel[] = null;

  constructor(private authService: AuthService,
              private firestore: AngularFirestore,
              private storageService: StorageService,
              private cellService: CellService) { }

  ngOnInit() {
    this.authService.userDetailsChanged.subscribe(
      (newUserDetails: UserModel) => {
        this.userDetails = newUserDetails;
        console.log(this.userDetails);
        if (this.userDetails) {
          this.storageService.userFilesDocument = this.firestore.doc(`json_files/${this.userDetails.id}`)
          this.storageService.userFilesDocRef = this.storageService.userFilesDocument.get();
          this.storageService.fetchUserJson();
        }
      }
    );

    this.storageService.userJsonObjectsChanged.subscribe(
      (objects: {
        downloadUrl: string,
        fullPath: string,
        name: string
      }[]) => {
        this.userJsonObjects = objects;
        this.userJsonTitles = objects.map(obj => obj.name);
        this.selectedTitle = this.userJsonTitles[0];
      }
    );
  }
  onChange(event: Event) {
    console.log((<HTMLInputElement>event.target).value);
    this.selectedTitle = (<HTMLInputElement>event.target).value;
  }

  onLoadClicked() {
    const selectedObject = this.userJsonObjects.find(
      (object: {
        downloadUrl: string,
        fullPath: string,
        name: string
      }) => object.name === this.selectedTitle
    );

    console.log(selectedObject.downloadUrl);
    fetch(selectedObject.downloadUrl)
      .then(resp => resp.json())
      .then(data => {
        console.log(JSON.parse(data));
        this.newSelectedJsonFile = JSON.parse(data);
        this.cellService.setCurrentJsonFile(this.newSelectedJsonFile);
      })
      .catch(err => {
        alert(err);
        console.log(err);
      });
  }

  setLoadingState(event: boolean) {
    console.log(event);
    this.isLoading = event;
  }
}
