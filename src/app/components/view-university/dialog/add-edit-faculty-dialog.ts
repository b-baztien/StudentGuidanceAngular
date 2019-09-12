import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Major } from 'src/app/model/Major';
import { Faculty } from 'src/app/model/Faculty';
import { Component, OnInit, Inject } from '@angular/core';
import { ListMajorDialog } from './list-major-dialog';

@Component({
    selector: 'add-edit-faculty-dialog',
    templateUrl: 'add-edit-faculty-dialog.html',
  })
  export class AddEditFacultyDialog implements OnInit {
    displayedColumns: string[] = ['major_name', 'url'];
    majorLtb: MatTableDataSource<Major>;
    listMajor: Major[] = new Array<Major>();
  
    constructor(
      public dialogRef: MatDialogRef<AddEditFacultyDialog>,
      @Inject(MAT_DIALOG_DATA) public data: Faculty) {
    }
  
    async ngOnInit() {
      let listMajorData = new Array<Major>();
      this.data.major.forEach(async listMajorRef => {
        let observer = listMajorRef.onSnapshot(async result => {
          console.log(result.data());
          await this.listMajor.push(await result.data() as Major);
          this.majorLtb = await new MatTableDataSource<Major>(this.listMajor);
        });
      });
      console.log(await this.listMajor[0]);
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }