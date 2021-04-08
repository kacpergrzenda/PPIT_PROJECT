import { Component,  Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HomeComponent} from '../../pages/home/home.component'
@Component({
  selector: 'app-dialog-message',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.css']
})
export class DialogMessageComponent   {
  dialogPicture: any;
  constructor(
    public dialogRef: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  
  /* Select File From Pc and set it as a url */
  onselectFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.dialogPicture = event.target.result;
        this.data.dialogPicture =  this.dialogPicture;
      }
    }
  }
}

export interface DialogData {
  newMsg: string;
  dialogPicture: any;
}
