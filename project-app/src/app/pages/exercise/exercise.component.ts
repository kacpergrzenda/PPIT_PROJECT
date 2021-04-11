import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit {

  //Object array Videos.
  allVideo: any[] = [
    {
      "video": "FYJJbwG_i8U", "type": "running"
    },
    {
      "video": "TVUXbF40lEQ", "type": "running"
    },
    {
      "video": "VOJcJHX9VpU", "type": "running"
    },
    {
      "video": "cuHwoCWFLIw", "type": "weight"
    },
    {
      "video": "H9vwqwN69rU", "type": "weight"
    },
    {
      "video": "xqVBoyKXbsA", "type": "weight"
    },
    {
      "video": "9D6DluTzcNA", "type": "swimming"
    },
    {
      "video": "IKWGF4kP8Cs", "type": "swimming"
    },
    {
      "video": "R_LK7uu2-oQ", "type": "swimming"
    }
  ];
  //Variables
  apiLoaded = false;
  swimming = true;
  running = true;
  weight = true;

  constructor(public authService: AuthService, private sanitizer: DomSanitizer) {

  }


  ngOnInit(): void {

    // Check is Api is loaded to allow Videos to Work
    if (!this.apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }





  //SignOut User
  onSignOut() {
    this.authService.signOut()
  }

}
