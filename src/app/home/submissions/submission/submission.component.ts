import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() setLoading = new EventEmitter<boolean>() ;

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
    console.log(jsonData);
    let fileName = this.fileToUpload.name.split('.')[0];
    if (this.filenameInput.length > 0) fileName = this.filenameInput.trim().replace(/\s+/g, '_');
    const file = new File([JSON.stringify(jsonData)], `${fileName}.json`, { type: 'application/json'});
    console.log(file);
    if (jsonData.length > 0) this.uploadToFireStorage(file);
    else {
      alert('something went wrong!');
      console.log(jsonData);
    }
  }

  async generateJsonData(csvFile: File) {
    const formData = new FormData();
    formData.append('csv_file', csvFile);

    let jsonData = []

    this.setLoading.emit(true);
    await fetch('https://cell-visualizer.herokuapp.com/upload_csv', {
      method: 'POST',
      body: formData
    }).then(
      resp => resp.json()
    ).then(data => {
      jsonData = data.json_data;
      this.setLoading.emit(false);
    }
    ).catch(err => {
      alert(err);
      console.log(err);
      this.setLoading.emit(false);
    });

    return jsonData;
  }

  uploadToFireStorage(file: File) {
    console.log(this.userDetails)
    let id = `json_files/${this.userDetails.id}/${this.generateNewFileTitle(file.name)}`;

    this.fileDNE = true;
    this.ref = this.firebaseStorage.ref(id);
    this.task = this.ref.put(file);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));

    this.uploadProgress = this.task.percentageChanges();
    
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
