import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-progress-spinner-dialog',
  templateUrl: './progress-spinner-dialog.component.html',
  styleUrls: ['./progress-spinner-dialog.component.css']
})
export class ProgressSpinnerDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProgressSpinnerDialogComponent>
  ) { }



  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}