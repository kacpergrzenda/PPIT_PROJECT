import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import firebase from "firebase/app";


import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'src/app/dialogs/dialog-message/dialog-message.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // User Information Variables.
  userId: any;
  userEmail: any;
  user: any;
  picture: any;
  name: any;

  // Chat Variables.
  chat$: Observable<any> | undefined;

  //Dialog variables.
  newMsg: any;
  dialogPicture: any;

  constructor(public cs: ChatService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    /* Authenticate User */
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.userId = user.uid;
        this.userEmail = user.email;
        this.user = user;
        const p = user.photoURL;
        //x14Mi51fnqNqU5uNNiDs7YQ8aRh2

        /* Join user Chats to the User */
        const source = this.cs.get();
        this.chat$ = this.cs.joinUsers(source);

        this.scrollBottom();


        /* Get User Data from firestore user collection */
        const db = firebase.firestore();
        const docRef = db.collection('users').doc(user.uid);

        docRef.get().then((doc) => {
          if (doc.exists) {
            this.picture = doc.get("profilePicture");
            this.name = doc.get("displayName");
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

  /* Signs user out. */
  onSignOut() {
    this.authService.signOut()
  }

  /* Tracker To allow sort message in feed. */
  trackByCreated(i: any, msg: any) {
      return msg.createdAt;
  }

  /* Scroll to the bottom of the screen to see the most recent message. */
  private scrollBottom() {
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }

  /* Creates a Dialog that allows user to send a message. */
  openDialog() {
    let dialogRef = this.dialog.open(DialogMessageComponent, { data: { newMsg: this.newMsg, dialogPicture: this.dialogPicture } });
    dialogRef.afterClosed().subscribe(result => {

      /* If message isnt a null submit request to send*/
      if (result != null) {
        this.submit(this.user.uid, result)
      }
    })
  }

  /* Calls a function in the chat service that sends the user message to the feed. */
  submit(chatId: any, message: any) {
    this.cs.sendMessage(chatId, message);
  }

  /* Select File From Pc and set it as a url */
  onselectFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.dialogPicture = event.target.result;
      }
    }
  }

}






