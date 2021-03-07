import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
   constructor(public authService: AuthService) { }

  ngOnInit(): void {
    
     this.user =  JSON.parse(localStorage.getItem('user') || '{}');
      
  }



}
