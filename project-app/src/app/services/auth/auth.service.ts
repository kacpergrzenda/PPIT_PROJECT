import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/user.model'; // User

import * as firebase from 'firebase';
// import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  userData: any; // Save logged in user data
  //let user
  constructor(
    private afAuth: AngularFireAuth, //Firebase Auth Service
    private afs: AngularFirestore, //FireStore service 
    private router: Router,
    private ngZone: NgZone,
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user') || '{}');
      } else {
        localStorage.setItem('user', '{}');
        JSON.parse(localStorage.getItem('user') || '{}');
      }
    })
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

  //signUp method is a request to our Firebase Authentication to create a new user
  async signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* OPENS SNAKCBAR AT THE BOTTOM OF THE SCREEN WITH MESSAGE */
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        /* OPENS SNAKCBAR AT THE BOTTOM OF THE SCREEN WITH MESSAGE */
        window.alert(error.message)
      })
  }

  // //SignUp
  // async signIn(email: string, password: string) {
  //   return this.afAuth.signInWithEmailAndPassword(email, password)
  // }


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
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // //UpdateUserData
  // async updateUserData(user : any) {
  //   // Sets user data to firestore on login
  //   const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

  //   const data = { 
  //     uid: user.uid,
  //     displayName: user.displayName, 
  //     email: user.email, 
  //     password: user.password
  //   } 

  //   return userRef.set(data, { merge: true })

  // }

  //Signout
  async signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    })
  }



}
