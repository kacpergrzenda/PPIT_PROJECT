import { Component, OnInit, TestabilityRegistry } from '@angular/core';
import firebase from 'firebase/app';
import firestore from 'firebase/app';
import 'firebase/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';

import { DialogVideoComponent } from 'src/app/dialogs/dialog-video/dialog-video.component'

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit {

  //Variables
  apiLoaded = false;
  swimming = true;
  running = true;
  weight = true;
  videos: any;
  user: any;
  addvideourl: any;
  videotype: any;

  constructor(public authService: AuthService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private afs: AngularFirestore) {

  }


  ngOnInit(): void {

    /* Authenticate User */
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {

        this.user = user;


        /* Get Data from firestore videos collection */
        const db = firebase.firestore();
        const docRef = db.collection('videos').doc('videos');
        docRef.get().then((doc) => {
          if (doc.exists) {
            /* Set array of videos from firestore to videos*/
            this.videos = doc.get("videos");
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        });


        /* Check is Api is loaded to allow Videos to Work with Youtube-Player*/
        if (!this.apiLoaded) {
          // This code loads the IFrame Player API code asynchronously, according to the instructions at
          // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          document.body.appendChild(tag);
          this.apiLoaded = true;
        }
      } else {
        // User is signed out
        // ...
      }
    });
  }


  /* Creates a Dialog that allows administrator to send a message. */
  openDialog() {
    let dialogRef = this.dialog.open(DialogVideoComponent, { data: { url: this.addvideourl, type: this.videotype } });

    dialogRef.afterClosed().subscribe(result => {

      /* If message isnt a null submit request to send*/
      if (result != null && (result[1] == "running" || result[1] == "swimming" || result[1] == "weight")) {
        if (this.user.uid == "GxBXYdMVVtbRzuKcCmzoh1EcfvS2") {
          this.addVideo(result[0], result[1]);
        }
      }
    })
  }

  /* Adds Video to videos Collection on Firestore Database. */
  addVideo(url: any, type: any) {

    const data = {
      url,
      type
    };

    const ref = this.afs.collection('videos').doc('videos');
    return ref.update({
      videos: firestore.firestore.FieldValue.arrayUnion(data)
    });

  }

  /* Delets Video from videos Collection on Firestore Database. */
  async deleteVideo(url: any, type: any) {
    let videoRef:any;
    const db = firebase.firestore();
    videoRef = db.collection('videos').doc('videos');

    var removeVideo = videoRef.update({
      'videos': firestore.firestore.FieldValue.arrayRemove({'url':url, 'type':type})
    })

  }

  //SignOut User
  onSignOut() {
    this.authService.signOut()
  }

}
