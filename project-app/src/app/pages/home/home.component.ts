import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/user.model';
import firebase from "firebase/app";
import "firebase/auth";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userId: any;
  userEmail: any;
   constructor(public authService: AuthService) { }

  ngOnInit(): void {
    
     //this.user =  JSON.parse(localStorage.getItem('user') || '{}');

     firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.userId = user.uid;
        this.userEmail = user.email;

        // ...
      } else {
        // User is signed out
        // ...
      }
    });
      
  }



}
