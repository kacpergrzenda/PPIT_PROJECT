import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ExerciseComponent } from '../../pages/exercise/exercise.component'
@Component({
  selector: 'app-dialog-video',
  templateUrl: './dialog-video.component.html',
  styleUrls: ['./dialog-video.component.css']
})
export class DialogVideoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ExerciseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

}

export interface DialogData {
  addvideourl: any;
  videotype: any;
}
