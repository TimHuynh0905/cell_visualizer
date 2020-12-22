import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/shared/user.model';
import { SubmissionsService } from '../submissions.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
  uploadBtnDisabled: boolean = true;
  fileToUpload: File;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  uploadState: Observable<string>;

  @Input() userDetails: UserModel;

  constructor(private firebaseStorage: AngularFireStorage,
              private submissionService: SubmissionsService) { }

  ngOnInit() {}

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
    this.uploadBtnDisabled = true;
    this.ref = this.firebaseStorage.ref(id);
    this.task = this.ref.put(this.fileToUpload);
    this.uploadProgress = this.task.percentageChanges();
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.task.then(
        async (snapShot: UploadTaskSnapshot) => {
          const { fullPath, name } = snapShot.ref;
          const downloadUrl = await snapShot.ref.getDownloadURL();
          this.submissionService.userFilesDocRef.subscribe(
            async snapShot => {
              if (!snapShot.exists) {
                await this.submissionService.userFilesDocument.set({
                  'fileArray': []
                });
              }
              Object.entries(snapShot.data()).forEach(
                async (entry, _) => {
                  await this.submissionService.userFilesDocument.update({
                    'fileArray':
                      [
                        { fullPath, name, downloadUrl },
                        ...entry[1]
                      ]
                  });
                }
              );
            }
          );
          this.submissionService.addNewUserFile({ fullPath, name, downloadUrl });
          (<HTMLInputElement>document.getElementById('file-upload')).value = '';
        }    
    ).catch(e => console.log(e.message));
  }

  onCancel() {
    this.task.cancel();
  }
}
