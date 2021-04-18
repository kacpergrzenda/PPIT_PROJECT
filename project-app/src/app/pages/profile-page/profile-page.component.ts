import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  // Variables.
  userEmail: any
  userUid: any
  name: any
  picture: any
  chat$: Observable<any> | undefined;
  user: any;
  height: any;
  weight: any;
  gender: any;
  url:any;

  informationForm: any;//Form Variable.

  //Getter/Accessors
  get heightControl() {
    return this.informationForm.get('height');
  }

  get weightControl() {
    return this.informationForm.get('weight');
  }

  get genderControl() {
    return this.informationForm.get('gender');
  }

  constructor(public authService: AuthService,
    public cs: ChatService, // Chat Ervice
    private afs: AngularFirestore, //FireStore service 
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {

    /* Information Form Controls */
    this.informationForm = new FormGroup({
      height: new FormControl(''),
      weight: new FormControl(''),
      gender: new FormControl('')
    })

    /* Authenticate User */
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        this.userEmail = user.email;
        this.userUid = user.uid;
        this.user = user;

        /* Join user Chats to the User and Get User Messages*/
        const source = this.cs.get();
        this.chat$ = this.cs.joinUsers(source);

        /* Get User Data from firestore user collection */
        const db = firebase.firestore();
        const docRef = db.collection('users').doc(user.uid);
        docRef.get().then((doc) => {
          if (doc.exists) {
            this.picture = doc.get("profilePicture");
            this.name = doc.get("displayName");
            this.height = doc.get("height");
            this.weight = doc.get("weight");
            this.gender = doc.get("gender");

          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        });

      } else {
        // User is signed out
        // ...
      }
    });


  }

  /* Sign User Out. */
  onSignOut() {
    this.authService.signOut()
  }

  /* Select File From Pc and set it as a url */
  onselectFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
    }
  }

  /* Save User Information On Firestore under user Database */
  onSaveProfile() {
    const ref = this.afs.collection('users').doc(this.user?.uid);

    ref.update({
      height: this.heightControl.value,
      weight: this.weightControl.value,
      gender: this.genderControl.value
    });

    this.snackBar.open("User Information Updated.");
  }

  /* Call Delete Message Function in Chat Service */
  onDeleteMessage(uid: any, content: any, createdAt: any, picture: any) {
    this.cs.deleteMessage(uid, content, createdAt, picture);
  }


}
