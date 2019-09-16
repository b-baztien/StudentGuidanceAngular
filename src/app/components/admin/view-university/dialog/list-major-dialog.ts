import { OnInit, Inject, Component } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Major } from 'src/app/model/Major';
import { Faculty } from 'src/app/model/Faculty';

@Component({
  selector: 'list-major-dialog',
  templateUrl: 'list-major-dialog.html',
})
export class ListMajorDialog implements OnInit {
  displayedColumns: string[] = ['major_name', 'url'];
  majorLtb: MatTableDataSource<Major>;
  listMajor: Major[] = new Array<Major>();

  constructor(
    public dialogRef: MatDialogRef<ListMajorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Faculty) {
  }

  async ngOnInit() {
    this.majorLtb = await new MatTableDataSource<Major>(this.data.major);
    console.log(await this.listMajor[0]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}