import { Injectable, OnDestroy, inject } from '@angular/core';
import { FirebaseApps } from '@angular/fire/app';
import {
  Auth,
  User,
  user,
  getAuth,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from '@angular/fire/auth';
import { getDoc } from 'firebase/firestore';
import { Observable, Subscription, map } from 'rxjs';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';
import { FirestoreDataService } from './firestore-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dataService = inject(FirestoreDataService);
  auth!: Auth;
  user$!: Observable<User | null>;
  emailProvider = new EmailAuthProvider();
  userid: string | null = null;
  currentUser: User | null = null;

  constructor(private allFirebaseApps: FirebaseApps) {
    let app = this.findApp();
    if (app) {
      this.auth = getAuth(app);
      this.user$ = user(this.auth);
    }
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userid = user.uid;
      } else {
        this.userid = null;
      }
    });
  }

  findApp() {
    let app = this.allFirebaseApps.find((obj) => obj.name === 'clone');
    return app;
  }

  async register(mail: any, pw: string) {
    await createUserWithEmailAndPassword(this.auth, mail, pw)
      .then((userCredential) => {
        this.currentUser = userCredential.user;
      })
      .catch((e) => {
        throw e.message;
      });
  }

  async signIn(mail: any, pw: string) {
    await signInWithEmailAndPassword(this.auth, mail, pw)
      .then((userCredential) => {
        this.currentUser = userCredential.user;
      })
      .catch((e: Error) => {
        throw e.message;
      });
  }

  async logout() {
    await signOut(this.auth);
  }
}
