import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/shared/models/user.model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
  filenameInput: string = '';
  fileDNE: boolean = true;
  fileToUpload: File;

  userJsonTitles: string[] = [];

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  percent: number;
  uploadState: Observable<string>;

  @Input() userDetails: UserModel;

  constructor(private firebaseStorage: AngularFireStorage,
              private storageService: StorageService) { }

  ngOnInit() {
    this.storageService.userJsonObjectsChanged.subscribe(
      (objects: {
        downloadUrl: string,
        fullPath: string,
        name: string
      }[]) => {
        this.userJsonTitles = objects.map(obj => obj.name);
      }
    );
  }

  onFileChange(event: Event) {
    if ((<HTMLInputElement>event.target).files.length <= 0) {
      this.fileDNE = true;
      return;
    }

    this.fileDNE = false;
    this.fileToUpload = (<HTMLInputElement>event.target).files[0];
    console.log(this.fileToUpload);
  }

  async onSubmit() {
    const jsonData = await this.generateJsonData(this.fileToUpload);
    let fileName = this.fileToUpload.name.split('.')[0];
    if (this.filenameInput.length > 0) fileName = this.filenameInput.trim().replace(/\s+/g, '_');
    const file = new File([JSON.stringify(jsonData)], `${fileName}.json`, { type: 'application/json'});
    console.log(file);
    this.uploadToFireStorage(file)
  }

  async generateJsonData(csvFile: File) {
    const formData = new FormData();
    formData.append('csv_file', csvFile);

    let jsonData = []

    await fetch('https://cell-visualizer.herokuapp.com/upload_csv', {
      method: 'POST',
      body: formData
    }).then(
      resp => resp.json()
    ).then(data => jsonData = data.json_data
    ).catch(err => {
      alert(err);
      console.log(err);
    });

    return jsonData;
  }

  uploadToFireStorage(file: File) {
    let id = `json_files/${this.userDetails.displayName}/${this.generateNewFileTitle(file.name)}`;

    this.fileDNE = true;
    this.ref = this.firebaseStorage.ref(id);
    this.task = this.ref.put(file);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));

    this.uploadProgress = this.task.percentageChanges();
    // this.uploadProgress.subscribe(x => {
    //   this.percent = x;
    // });

    this.task.then(
      async (snapShot: UploadTaskSnapshot) => {
        const { fullPath, name } = snapShot.ref;
        const downloadUrl = await snapShot.ref.getDownloadURL();
        this.storageService.userFilesDocRef.subscribe(
          async snapShot => {
            if (!snapShot.exists) {
              await this.storageService.userFilesDocument.set({
                'fileArray': [ { fullPath, name, downloadUrl } ]
              }).then(() => {
                this.storageService.addNewUserFile({ fullPath, name, downloadUrl });
              }).catch(err => {
                alert(err);
                console.log(err);
              });
            } else {
              await this.storageService.userFilesDocument.update({
                'fileArray':
                  [
                    { fullPath, name, downloadUrl },
                    ...Object.entries(snapShot.data())[0][1]
                  ]
              }).then(() => {
                this.storageService.addNewUserFile({ fullPath, name, downloadUrl });
              }).catch(err => {
                alert(err)
                console.log(err);
              });
            }
          }
        );
      }    
    ).catch(e => console.log(e.message));

    (<HTMLInputElement>document.getElementById('file-upload')).value = '';
    this.filenameInput = '';
  }

  onCancel() {
    this.task.cancel();
  }

  generateNewFileTitle(titleToAdd: string) {
    return `${Date.now()}-${titleToAdd}`;
  }
}
