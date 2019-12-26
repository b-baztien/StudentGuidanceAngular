import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Faculty } from 'src/app/model/Faculty';
import { MatTableDataSource, MatPaginator, MatDialog, MatPaginatorIntl } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddEditFacultyDialogComponent } from './dialog/add-edit-faculty-dialog/add-edit-faculty-dialog.component';
import { FacultyService } from 'src/app/services/faculty-service/faculty.service';
import { AddMajorDialogComponent } from './dialog/add-major-dialog/add-major-dialog.component';
import { EditUniversityDialogComponent } from './dialog/edit-university-dialog/edit-university-dialog.component';
import { QueryDocumentSnapshot, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ListMajorAdminDialogComponent } from './dialog/list-major-dialog/list-major-dialog.component';
import { ConfirmDialogComponent } from '../../util/confirm-dialog/confirm-dialog.component';
import { Notifications } from '../../util/notification';



@Component({
  selector: 'app-view-university',
  templateUrl: './view-university.component.html',
  styleUrls: ['./view-university.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewUniversityComponent implements OnInit {
  university: University;
  university_id;

  universityImg: string = 'assets/img/no-photo-available.png';

  showContent: boolean = false;
  showTable: boolean = false;

  facultyLtb: MatTableDataSource<DocumentData>;
  displayedColumns: string[] = ['faculty_name', 'url', 'major', 'manage'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  paginatorInit = new MatPaginatorIntl;

  constructor(
    private universityService: UniversityService,
    private facultyService: FacultyService,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.university_id = this.activeRoute.snapshot.paramMap.get('university');
    if (this.university_id === null) {
      window.location.replace('/admin');
    }
    this.getUniversity(this.university_id);
    this.getFaculty(this.university_id);
  }

  private getUniversity(university_id: string) {
    this.universityService.getUniversity(university_id).subscribe(async universityRes => {
      this.university = universityRes.data() as University;
      if (this.university.image === undefined || this.university.image == '') return;

      this.afStorage.storage.ref(this.university.image).getDownloadURL().then(url => {
        this.universityImg = url;
      });

      if (undefined === this.university) {
        this.showContent = false;
      } else {
        this.showContent = true;
      }
    });
  }

  private getFaculty(university_id: string) {
    this.facultyService.getFacultyByUniversityId(university_id).subscribe(fct => {
      this.facultyLtb = new MatTableDataSource<QueryDocumentSnapshot<unknown>>(fct.docs);
      this.facultyLtb.paginator = this.paginator;

      //custom text paginator
      this.paginatorInit.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 จากทั้งหมด ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} จากทั้งหมด ${length}`;
      };
      this.paginatorInit.changes.next();
      this.paginator._intl = this.paginatorInit;

      if (this.facultyLtb.data.length === 0) {
        this.showTable = false;
      } else {
        this.showTable = true;
      }
    });
  }

  applyFilter(filterValue: string) {
    this.facultyLtb.filter = filterValue.trim().toLowerCase();
  }

  openEditUniversityDialog(): void {
    const dialogRef = this.dialog.open(EditUniversityDialogComponent, {
      width: '90%',
      height: '90%',
      data: { universityId: this.university_id, university: this.university },
    });

    dialogRef.afterClosed().subscribe(universityRs => {
      this.universityService.updateUniversity(this.university_id, universityRs);
    });
  }

  openDeleteUniversityDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: 'auto',
      data: `คุณต้องการลบข้อมูล${this.university.university_name} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        if (result) {
          this.universityService.deleteUniversity(this.university_id);
          new Notifications().showNotification('done', 'top', 'right', 'ลบข้อมูลมหาวิทยาลัยสำเร็จแล้ว', 'success', 'สำเร็จ !');
          this.router.navigate(['/admin/list-university/']);
        }
      } catch (error) {
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'ลบข้อมูลล้มเหลว !');
      }
    });
  }

  openAddMajorDialog(faculty: QueryDocumentSnapshot<unknown>) {
    const dialogRef = this.dialog.open(AddMajorDialogComponent, {
      width: '90%',
      data: faculty.id,
    });

    dialogRef.afterClosed().subscribe();
  }

  openAddEditFacultyDialog(faculty?: QueryDocumentSnapshot<unknown>): void {
    const dialogRef = this.dialog.open(AddEditFacultyDialogComponent, {
      width: '90%',
      data: faculty ? faculty.data() as Faculty : null,
    });

    dialogRef.afterClosed().subscribe(facultyRs => {
      try {
        if (facultyRs === null || facultyRs === undefined) return;
        if (facultyRs.mode === 'เพิ่ม') {
          this.facultyService.addFaculty(this.university_id, facultyRs.faculty);
          new Notifications().showNotification('done', 'top', 'right', 'เพิ่มข้อมูลคณะสำเร็จแล้ว', 'success', 'สำเร็จ !');
        } else if (facultyRs.mode === 'แก้ไข') {
          this.facultyService.updateFaculty(faculty.id, facultyRs.faculty);
          new Notifications().showNotification('done', 'top', 'right', 'แก้ไขข้อมูลคณะสำเร็จแล้ว', 'success', 'สำเร็จ !');
        }
      } catch (error) {
        console.error(error);
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'จัดการข้อมูลล้มเหลว !');
      }
    });
  }

  openDeleteFacultyDialog(faculty: QueryDocumentSnapshot<unknown>) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: 'auto',
      data: `คุณต้องการลบข้อมูลคณะ${(faculty.data() as Faculty).faculty_name} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        if (result) {
          this.facultyService.deleteFaculty(faculty);
          new Notifications().showNotification('done', 'top', 'right', 'ลบข้อมูลคณะสำเร็จแล้ว', 'success', 'สำเร็จ !');
        }
      } catch (error) {
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'ลบข้อมูลล้มเหลว !');
      }
    });
  }

  openListMajorDialog(faculty: DocumentReference) {
    const dialogRef = this.dialog.open(ListMajorAdminDialogComponent, {
      width: 'auto',
      maxHeight: '90%',
      data: faculty,
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }
}