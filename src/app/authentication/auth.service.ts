import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from  'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { UserModel } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<firebase.User>;

  userDetailsChanged = new EventEmitter<UserModel>();
  private userDetails: UserModel = null;

  private userAuth: firebase.User = null;

  constructor(private firebaseAuth: AngularFireAuth,
              private router: Router) {
    this.user = firebaseAuth.authState;
    this.user.subscribe(
      async (userAuth: firebase.User) => {
        this.userAuth = userAuth ? userAuth : null;
        this.userDetails = userAuth ? await this.fetchUserDocument() : null;
        this.userDetailsChanged.emit(this.userDetails);
        console.log(this.userDetails);
      }
    );
  }

  async signin(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(msg => {
        console.log(msg);
        this.router.navigate(['/']);
      })
      .catch(e => {
        console.log(e);
      });
  }

  async signout() {
    await this.firebaseAuth.signOut()
      .then(msg => {
        console.log(msg);
        this.router.navigate(['/signin']);
      })
      .catch(e => {
        console.log(e);
      });
  }

  async register(username: string, email: string, password: string) {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(async (userCredential: firebase.auth.UserCredential) => {
        const { user } = userCredential;
        console.log(user);
        await this.createUserProfileDocument(user, username);
        this.router.navigate(['/signin']);
      })
      .catch(e => console.log(e.message));
  }

  async createUserProfileDocument(userAuth, additionalData) {
    if (!userAuth) return;

    const userRef = firebase.firestore().doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { email } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
              email,
              createdAt,
              ...additionalData 
            });
        } catch (e) {
            console.log('error creating user', e.message);
        }
    }
    return userRef;
  }

  async fetchUserDocument(): Promise<UserModel> {
    if (!this.userAuth) return;

    const userRef = firebase.firestore().doc(`users/${this.userAuth.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot.exists) return;

    const { displayName, email, createdAt } = snapShot.data();

    return new UserModel(
      snapShot.id,
      displayName,
      email,
      createdAt
    );
  }
}
