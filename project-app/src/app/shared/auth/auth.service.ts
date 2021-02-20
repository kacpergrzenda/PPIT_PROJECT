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


  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) { 
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
  async signUp(email: string, password: string, username: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
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
