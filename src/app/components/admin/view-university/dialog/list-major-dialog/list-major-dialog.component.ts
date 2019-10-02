import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { MajorService } from 'src/app/services/major-service/major.service';
import { Major } from 'src/app/model/Major';

@Component({
  selector: 'app-list-major-dialog',
  templateUrl: './list-major-dialog.component.html',
  styleUrls: ['./list-major-dialog.component.css']
})
export class ListMajorDialogComponent implements OnInit {
  displayedColumns: string[] = ['major_name', 'url'];
  majorLtb: MatTableDataSource<QueryDocumentSnapshot<unknown>>;
  listMajor = new Array<QueryDocumentSnapshot<unknown>>();
  showTable = false;

  constructor(
    private majorService: MajorService,
    public dialogRef: MatDialogRef<ListMajorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueryDocumentSnapshot<unknown>) {
  }

  async ngOnInit() {
  }

  ngAfterViewInit() {
    this.majorService.getMajorByFacultyId(this.data.id).subscribe(listMajorDoc => {
      this.listMajor = listMajorDoc;
      this.majorLtb = new MatTableDataSource<QueryDocumentSnapshot<unknown>>(this.listMajor);
      if(this.majorLtb === undefined || this.majorLtb.data.length === 0) {
        this.showTable = false;
      } else {
        this.showTable = true;
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
