import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';

import { MatCardModule } from '@angular/material/card';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';





@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCommonModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    RouterModule.forChild([{ path: '', component: SignupComponent }]),
  ]
})
export class SignupModule { }
