import { Component, OnInit, Inject } from '@angular/core';
import { Major } from 'src/app/model/Major';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CarrerService } from 'src/app/services/carrer-service/carrer.service';
import { MajorService } from 'src/app/services/major-service/major.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-list-major-dialog',
  templateUrl: './list-major-dialog.component.html',
  styleUrls: ['./list-major-dialog.component.css']
})
export class ListMajorTeacherDialogComponent implements OnInit {
  displayedColumns: string[] = ['major_name', 'url'];
  listMajor = new Array<Major>();
  listCarrer = new Array<QueryDocumentSnapshot<unknown>>();
  haveCarrer = false;
  showData = false;

  constructor(
    private carrerService: CarrerService,
    private majorService: MajorService,
    public dialogRef: MatDialogRef<ListMajorTeacherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueryDocumentSnapshot<unknown>) {
  }

  async ngOnInit() {
    this.majorService.getMajorByFacultyId(this.data.id).subscribe(listMajorDoc => {
      this.listMajor = new Array<Major>();
      listMajorDoc.forEach(major => {
        this.listMajor.push(major.data() as Major);
      })
      if (this.listMajor === undefined || this.listMajor.length === 0) {
        this.showData = false;
      } else {
        this.showData = true;
      }
    });
  }

  ngAfterViewInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
