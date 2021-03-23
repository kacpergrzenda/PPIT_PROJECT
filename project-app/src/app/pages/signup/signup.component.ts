import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: any;//Form variable
  hide = true;
  //Getter/Accessors
  get usernameControl() {
    return this.signupForm.get('displayName');
  }

  get passwordControl() {
    return this.signupForm.get('password');
  }

  get emailControl() {
    return this.signupForm.get('email');
  }

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private firestore: AngularFirestore
  ) { }


  ngOnInit(): void {
    this.signupForm = new FormGroup({
      displayName: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  //signup request from the AuthService once the user submits the form
  onSignUp() {
    this.authService.signUp(this.emailControl.value,this.passwordControl.value)
    .then((userCredential) => {
       // Signed in 
       var user = userCredential.user;
         /* OPENS SNAKCBAR AT THE BOTTOM OF THE SCREEN WITH MESSAGE */
        this.snackBar.open('You signed up to this app!');
        /* WRITING TO FIRESTORE DATABASE AND SAVING EMAIL, PASSWORD, USERNAME */
        // this.firestore.collection('users').add({
        //   email: this.signupForm.value.email,
        //   uid: user?.uid
        // })
        this.router.navigate(['home']);

      })
      .catch(
        (error) => {
          /* OPENS SNAKCBAR AT THE BOTTOM OF THE SCREEN WITH MESSAGE */
          this.snackBar.open('There was a problem while trying to sign up a new user' + error.code +  error.message);
        });
  }

  

}
