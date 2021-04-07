import {  Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import firebase from "firebase/app";
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { DialogMessageComponent } from 'src/app/dialogs/dialog-message/dialog-message.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userId: any;
  userEmail: any;
  user: any;


  chat$: Observable<any> | undefined;
  newMsg: any;

  constructor(public cs: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.userId = user.uid;
        this.userEmail = user.email;
        this.user = user;
        console.log(this.userEmail)

        const source = this.cs.get();

        this.chat$ = this.cs.joinUsers(source);
        console.log("chat:" + this.chat$)
        this.scrollBottom();
        //console.log(source)



        // ...
      } else {
        // User is signed out
        // ...
      }
    });

  }


  onSignOut() {
    this.cs.create()
    this.authService.signOut()
  }

  submit(chatId: any, message: any) {
    this.cs.sendMessage(chatId, message);
  }

  trackByCreated(i: any, msg: any) {
    return msg.createdAt;
  }

  sendMessage() {
    this.cs.sendMessage(this.user.uid, 'Im Bob I just lifted 100punds');
  }

  private scrollBottom() {
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }

  openDialog() {
    let dialogRef = this.dialog.open(DialogMessageComponent, { data: {newMsg: this.newMsg}});

    dialogRef.afterClosed().subscribe( result => {
      if(result == String){
        this.submit(this.user.uid, result)
      }   
    })
  }



}






