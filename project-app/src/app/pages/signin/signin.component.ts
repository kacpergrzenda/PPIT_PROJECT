import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: any;//Form variable
  hide = true;
 

  /* Accessors */
  get passwordControl() {
    return this.signinForm.get('password');
  }

  get emailControl() {
    return this.signinForm.get('email');
  }


  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signinForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }

  onSignin() {
    this.authService.signIn(this.emailControl.value, this.passwordControl.value).
    then(() => {
      //this.snackBar.open('YOUR SIGNED IN!');
    })
      // then((UserCredential) => {
      //   var user = UserCredential.user;
      //   // Once Logged in Navigates User to Home Page.
      //   this.router.navigate(['home']).then(successful => {
      //     this.authService.updateUserData(user);
      //   }) 
      //   this.snackBar.open('YOUR SIGNED IN! ');
      // })
      // .catch(
      //   (_err: any) => {
      //     /* OPENS SNAKCBAR AT THE BOTTOM OF THE SCREEN WITH MESSAGE */
      //     this.snackBar.open('There was a problem while trying to sign IN a new user');
      //   });
  }

}
