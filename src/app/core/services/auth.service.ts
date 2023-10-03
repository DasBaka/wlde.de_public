import { Injectable, OnDestroy } from '@angular/core';
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
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  auth!: Auth;
  user$!: Observable<User | null>;
  userSub!: Subscription;
  emailProvider = new EmailAuthProvider();
  userid: string | null = null;
  currentUser: User | null = null;

  constructor(private allFirebaseApps: FirebaseApps) {
    let app = this.findApp();
    if (app) {
      this.auth = getAuth(app);
      this.user$ = user(this.auth);
      this.userSub = this.user$.subscribe((aUser: User | null) => {
        this.currentUser = aUser;
      });
    }
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userid = user.uid;
      } else {
        this.userid = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
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
        console.log(e.code, e.message);
      });
  }

  async signIn(mail: any, pw: string) {
    await signInWithEmailAndPassword(this.auth, mail, pw)
      .then((userCredential) => {
        this.currentUser = userCredential.user;
      })
      .catch((e) => {
        console.log(e.code, e.message);
      });
  }

  logout() {
    signOut(this.auth);
  }
}
