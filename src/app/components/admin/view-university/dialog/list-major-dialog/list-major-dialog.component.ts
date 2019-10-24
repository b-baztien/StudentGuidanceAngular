import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { MajorService } from 'src/app/services/major-service/major.service';
import { Carrer } from 'src/app/model/Carrer';
import { CarrerService } from 'src/app/services/carrer-service/carrer.service';
import { Major } from 'src/app/model/Major';
import { EditMajorComponent } from './dialog/edit-major/edit-major.component';

@Component({
  selector: 'app-list-major-dialog',
  templateUrl: './list-major-dialog.component.html',
  styleUrls: ['./list-major-dialog.component.css']
})
export class ListMajorAdminDialogComponent implements OnInit {
  displayedColumns: string[] = ['major_name', 'url'];
  listMajor = new Array<Major>();
  listCarrer = new Array<QueryDocumentSnapshot<unknown>>();
  haveCarrer = false;
  showData = false;

  constructor(
    private carrerService: CarrerService,
    private majorService: MajorService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ListMajorAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueryDocumentSnapshot<unknown>) {
  }

  async ngOnInit() {
    this.majorService.getMajorByFacultyId(this.data.id).subscribe(listMajorDoc => {
      this.listMajor = new Array<Major>();
      listMajorDoc.forEach(major => {
        this.listMajor.push(major.data() as Major);
      });
      if (this.listMajor === undefined || this.listMajor.length === 0) {
        this.showData = false;
      } else {
        this.showData = true;
      }
    });
  }

  ngAfterViewInit() {
  }

  openEditMajorDialog(majorId: string): void {
    const dialogRef = this.dialog.open(EditMajorComponent, {
      width: '60%',
      data: this.majorService.getMajorById(majorId),
    });

    dialogRef.afterClosed().subscribe(universityRs => {
    });
  }

  onDelete(major: Major) {
    this.majorService.getMajor(`${major.major_name}${major.faculty.id}`).subscribe(result => {
      this.majorService.deleteMajor(result.payload);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
