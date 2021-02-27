import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/user.model'; // User

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user$: Observable<any>; // Save logged in user data

  constructor(
    private afAuth: AngularFireAuth, //Firebase Auth Service
    private afs: AngularFirestore, //FireStore service 
    private router: Router
  ) { 
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.user$ = this.afAuth.authState.pipe(
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

  //signUp method is a request to our Firebase Authentication to create a new user
  async signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
  }

  async signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
  }


  async updateUserData({ username, email, password }: User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${email}`);

    const data = { 
      username, 
      email, 
      password
    } 

    return userRef.set(data, { merge: true })

  }

  
  async signOut(){
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }

}
