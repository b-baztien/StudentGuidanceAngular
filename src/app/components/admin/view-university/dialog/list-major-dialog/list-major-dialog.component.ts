import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { MajorService } from 'src/app/services/major-service/major.service';
import { Career } from 'src/app/model/Career';
import { CareerService } from 'src/app/services/career-service/career.service';
import { Major } from 'src/app/model/Major';
import { EditMajorComponent } from './dialog/edit-major/edit-major.component';
import { Notifications } from 'src/app/components/util/notification';
import { ConfirmDialogComponent } from 'src/app/components/util/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-major-dialog',
  templateUrl: './list-major-dialog.component.html',
  styleUrls: ['./list-major-dialog.component.css']
})
export class ListMajorAdminDialogComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['major_name', 'url'];
  listMajor = new Array<Major>();
  haveCareer = false;
  showData = false;

  majorSub: Subscription;

  constructor(
    private careerService: CareerService,
    private majorService: MajorService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ListMajorAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentReference) {
  }

  ngOnInit() {
    this.majorSub = this.majorService.getMajorByFacultyReference(this.data).subscribe(majorDocs => {
      this.listMajor = majorDocs.docs.map(doc => doc.data() as Major);
      if (this.listMajor === undefined || this.listMajor.length === 0) {
        this.showData = false;
      } else {
        this.showData = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.majorSub.unsubscribe();
  }

  openEditMajorDialog(majorId: string): void {
    const dialogRef = this.dialog.open(EditMajorComponent, {
      width: '60%',
      data: this.majorService.getMajorById(majorId),
    });

    dialogRef.afterClosed().subscribe();
  }

  onDelete(major: Major) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '40%',
      data: `คุณต้องการลบข้อมูลสาขา${major.major_name} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        if (result) {
          this.majorService.getMajorById(`${major.major_name}${major.faculty.id}`).subscribe(result => {
            this.majorService.deleteMajor(result.payload);
          });
          new Notifications().showNotification('done', 'top', 'right', 'ลบข้อมูลสาขาสำเร็จแล้ว', 'success', 'สำเร็จ !');
        }
      } catch (error) {
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'ลบข้อมูลล้มเหลว !');
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
