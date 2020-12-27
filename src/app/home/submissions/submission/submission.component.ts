import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { json } from 'd3';
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
    const fileName = this.filenameInput.trim().replace(/\s+/g, '_')
    const file = new File([JSON.stringify(jsonData)], `${fileName}.json`, { type: 'application/json'});
    console.log(file);
    this.uploadToFireStorage(file)
  }

  async generateJsonData(csvFile: File) {
    const formData = new FormData();
    formData.append('csv_file', csvFile);

    let jsonData = []

    await fetch('http://localhost:5000/upload_csv', {
      method: 'POST',
      body: formData
    }).then(
      resp => resp.json()
    ).then(data => jsonData = data.json_data
    ).catch(err => console.log(err));

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
              });
            } else {
              await this.storageService.userFilesDocument.update({
                'fileArray':
                  [
                    { fullPath, name, downloadUrl },
                    ...Object.entries(snapShot.data())[0][1]
                  ]
              });
            }
            this.storageService.addNewUserFile({ fullPath, name, downloadUrl });
          }
        );
      }    
    ).catch(e => console.log(e.message));

    (<HTMLInputElement>document.getElementById('file-upload')).value = '';
  }

  onCancel() {
    this.task.cancel();
  }

  generateNewFileTitle(titleToAdd: string) {
    let counter = 0;
    this.userJsonTitles.forEach(
      (title: string) => 
        counter = title === titleToAdd ? counter + 1 : counter
    );
    // console.log(counter);

    if (counter > 0) {
      const currentTitleParts = titleToAdd.split('.');
      return currentTitleParts[0] + '_' + counter + '.' + currentTitleParts[1];
    }
    return titleToAdd;
  }
}
