import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAHL8d5EJHtlBM0_j3tJsqVDV93NO0Kvcc",
    authDomain: "advaita-cell-visualizer.firebaseapp.com",
    projectId: "advaita-cell-visualizer",
    storageBucket: "advaita-cell-visualizer.appspot.com",
    messagingSenderId: "802190683049",
    appId: "1:802190683049:web:c38e408ea1d8110e73f2b8",
    measurementId: "G-EQ6DEVH09N"
};

@NgModule({
    imports: [
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFirestoreModule
    ],
    exports: [
        AngularFireModule
    ],
})
export class FirebaseModule {}