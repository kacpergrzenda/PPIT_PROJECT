import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfilePageComponent } from './profile-page.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HttpClientModule } from '@angular/common/http';


// Auth service
import { AuthService } from "../../services/auth/auth.service";
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../environments/environment';//WebKey For Firebase
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';


@NgModule({
  declarations: [ProfilePageComponent],
  imports: [
    MatSnackBarModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    MatGridListModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: ProfilePageComponent }]),
    AngularFireModule.initializeApp(environment.firebaseConfig),//Initialize firebase key
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule
  ],
  providers: [AuthService],
})
export class ProfilePageModule { }
