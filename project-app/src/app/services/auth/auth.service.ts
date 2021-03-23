import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/user.model'; // User

import firebase from "firebase/app";
import "firebase/auth";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user: any; // Save logged in user data
  //let user
  constructor(
    private afAuth: AngularFireAuth, //Firebase Auth Service
    private afs: AngularFirestore, //FireStore service 
    private router: Router,
    private ngZone: NgZone,
  ) {
   
    // Get the auth state, then fetch the Firestore user document or return null
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
          // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    )
  }

  // this.user = this.afAuth.authState.pipe(
  //     switchMap(user => {
  //         // Logged in
  //       if (user) {
  //         return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
  //       } else {
  //         // Logged out
  //         return of(null);
  //       }
  //     })
  // )
  // this.afAuth.authState.subscribe(user => {
  //   if (user) {
  //     this.userData = user;
  //     localStorage.setItem('user', JSON.stringify(this.userData));
  //     JSON.parse(localStorage.getItem('user') || '{}');
  //   } else {
  //     localStorage.setItem('user', '{}');
  //     JSON.parse(localStorage.getItem('user') || '{}');
  //   }
  // })

  //signUp method is a request to our Firebase Authentication to create a new user   LOCAL STORAGE
  async signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
     }



  // Sign in with email/password
  async signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  /* Setting up user data when sign in with username/password, 
 sign up with username/password and sign in with social auth  
 provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  //Signout
  async signOut() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['menu']);
    })
  }



}
