import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserModel } from 'src/app/shared/user.model';
import { SubmissionsService } from './submissions.service';
import { CellModel } from 'src/app/shared/component.model';
import { CellService } from '../cell/cell.service';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
  providers: [ SubmissionsService ],
})
export class SubmissionsComponent implements OnInit {
  userDetails: UserModel = null;

  userJsonTitles: string[] = [];
  userJsonObjects: {
    downloadUrl: string,
    fullPath: string,
    name: string
  }[] = [];

  selectedTitle: string = '';
  newSelectedJsonFile: CellModel[] = null;

  constructor(private authService: AuthService,
              private firestore: AngularFirestore,
              private submissionService: SubmissionsService,
              private cellService: CellService) { }

  ngOnInit() {
    this.authService.userDetailsChanged.subscribe(
      (newUserDetails: UserModel) => {
        this.userDetails = newUserDetails;
        console.log(this.userDetails);
        if (this.userDetails) {
          this.submissionService.userFilesDocument = this.firestore.doc(`json_files/${this.userDetails.id}`)
          this.submissionService.userFilesDocRef = this.submissionService.userFilesDocument.get();
          this.submissionService.fetchUserJson();
        }
      }
    );

    this.submissionService.userJsonTitlesChanged.subscribe(
      (titles: string[]) => {
        this.userJsonTitles = titles;
        this.selectedTitle = this.userJsonTitles[0];
      }
    );

    this.submissionService.userJsonObjectsChanged.subscribe(
      (objects: {
        downloadUrl: string,
        fullPath: string,
        name: string
      }[]) => {
        this.userJsonObjects = objects;
        console.log(this.userJsonObjects);
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
      .catch(err => console.log(err));
  }
}
