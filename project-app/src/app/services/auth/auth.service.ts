import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/user.model'; // User
import firebase from "firebase/app";

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Variables.
  user: any; // Save logged in user data

  constructor(
    private afAuth: AngularFireAuth, //Firebase Auth Service
    private afs: AngularFirestore, //FireStore service 
    private router: Router, //Router
    private ngZone: NgZone,
  ) {

    /* Get the auth state, then fetch the Firestore user document or return null */
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.afs.doc(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    )
  }

  /* Firebase Authentication to create a new user */
  async signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)

  }

  /* Firebase Authentication to sign user in */
  async signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
        this.updateUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  /* Sign User Out. */
  async signOut() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['menu']);//Navigate User to Menu Page On Sign Out
    })
  }

  /* Updates User Data. */
  async updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email
    };

    return userRef.set(data, { merge: true });
  }

  /* Gets and returns User Information. */
  getUser() {
    return this.user.pipe(first()).toPrmise();
  }

  /* Password Reset Send User Email to allow them to change password*/
  resetPassword(email: any) {
    return this.afAuth.sendPasswordResetEmail(email)
  }



}
