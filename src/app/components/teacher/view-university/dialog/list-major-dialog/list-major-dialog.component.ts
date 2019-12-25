import { Component, OnInit, Inject } from '@angular/core';
import { Major } from 'src/app/model/Major';
import { QueryDocumentSnapshot, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { CareerService } from 'src/app/services/career-service/career.service';
import { MajorService } from 'src/app/services/major-service/major.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-list-major-dialog',
  templateUrl: './list-major-dialog.component.html',
  styleUrls: ['./list-major-dialog.component.css']
})
export class ListMajorTeacherDialogComponent implements OnInit {
  displayedColumns: string[] = ['major_name', 'url'];
  listMajor = new Array<DocumentData>();
  listCareer = new Array<QueryDocumentSnapshot<unknown>>();
  haveCareer = false;
  showData = false;

  constructor(
    private careerService: CareerService,
    public dialogRef: MatDialogRef<ListMajorTeacherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentData[]) {
  }

  async ngOnInit() {
    this.listMajor = this.data;
  }

  ngAfterViewInit() {
    if (this.listMajor === undefined || this.listMajor.length === 0) {
      this.showData = false;
    } else {
      this.showData = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
