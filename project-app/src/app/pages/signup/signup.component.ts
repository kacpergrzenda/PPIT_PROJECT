import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: any;//Form variable

  //Getter/Accessors
  get usernameControl() {
    return this.form.get('username');
  }

  get passwordControl() {
    return this.form.get('password');
  }

  get emailControl() {
    return this.form.get('email');
  }

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private firestore: AngularFirestore
  ) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  //signup request from the AuthService once the user submits the form
  onSignUp() {
    this.authService.signUp(
      this.emailControl.value,
      this.passwordControl.value,
      this.usernameControl.value
    ).then(
      () => {
        this.snackBar.open('You signed up to this app!');
        //MODIFY THIS LATER REDIRECT USER TO THE MAIN PAGE OF THE APP BY USING THE ROUTER AND NAVIGATE METHOD
        //WRITING TO FIRESTORE DATABASE
        this.firestore.collection('users').add({
          email: this.form.value.email,
          password: this.form.value.password,
          username: this.form.value.username
        })
          .then(res => {
            console.log(res);
            this.form.reset();
          })
          .catch(e => {
            console.log(e);
          })

      })
      .catch(
        (_err: any) => {
          this.snackBar.open('There was a problem while trying to sign up a new user');
        });
  }

}
