import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { AuthService } from 'src/app/authentication/auth.service';
import { UserModel } from 'src/app/shared/user.model';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
  uploadBtnDisabled: boolean = true;
  fileToUpload: File;
  userDetails: UserModel = null;
  task: AngularFireUploadTask;

  @Output() newUserJsonObject = new EventEmitter<{
    downloadUrl: string,
    fullPath: string,
    name: string
  }>();

  constructor(private firebaseStorage: AngularFireStorage,
              private authService: AuthService,
              private firestore: AngularFirestore) { }

  ngOnInit() {
    this.authService.userDetailsChanged.subscribe(
      (newUserDetails: UserModel) =>
        this.userDetails = newUserDetails
    );
  }

  onFileChange(event: Event) {
    if ((<HTMLInputElement>event.target).files.length <= 0) {
      this.uploadBtnDisabled = true;
      return;
    }

    this.uploadBtnDisabled = false;
    this.fileToUpload = (<HTMLInputElement>event.target).files[0];
    console.log(this.fileToUpload);
  }

  onSubmit() {
    const id = `json_files/${this.userDetails.displayName}/${this.fileToUpload.name}`;

    this.task = this.firebaseStorage.ref(id).put(this.fileToUpload);
    // console.log(this.task);

    this.task.then(
        async (snapShot: UploadTaskSnapshot) => {
          const { fullPath, name } = snapShot.ref;
          const downloadUrl = await snapShot.ref.getDownloadURL();
          
          const newObject = { fullPath, name, downloadUrl };

          let currentState = [];
          const userFilesDocument = this.firestore.doc(`json_files/${this.userDetails.id}`)
          const userFilesDocRef = await userFilesDocument.get();
          userFilesDocRef.subscribe(
            async snapShot => {
              if (snapShot.exists) {
                Object.entries(snapShot.data()).forEach(
                  async (entry, _) => {
                    currentState = entry[1];
                    await userFilesDocument.update({
                      'fileArray':
                        [
                          newObject,
                          ...currentState
                        ]
                    });
                  }
                );
              } else {
                await userFilesDocument.set({
                  'fileArray': [ newObject ]
                });
              }
            }
          );

          this.newUserJsonObject.emit(newObject);
        }
      )
      .catch(e => console.log(e.message));
  }
}
