import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Faculty } from 'src/app/model/Faculty';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddEditFacultyDialogComponent } from './dialog/add-edit-faculty-dialog/add-edit-faculty-dialog.component';
import { FacultyService } from 'src/app/services/faculty-service/faculty.service';
import { AddMajorDialogComponent } from './dialog/add-major-dialog/add-major-dialog.component';
import { EditUniversityDialogComponent } from './dialog/edit-university-dialog/edit-university-dialog.component';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ListMajorDialogComponent } from './dialog/list-major-dialog/list-major-dialog.component';



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
export class ViewUniversityComponent implements OnInit, AfterViewInit {
  university: University;
  listFaculty: Array<QueryDocumentSnapshot<unknown>>;

  university_id: string;

  universityImg: string = 'assets/img/college-graduation.png';

  showContent: boolean = false;
  showTable: boolean = false;

  facultyLtb: MatTableDataSource<QueryDocumentSnapshot<unknown>>;
  displayedColumns: string[] = ['faculty_name', 'url', 'major', 'manage'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

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
  }

  async ngAfterViewInit() {
    await this.getUniversity(this.university_id);
  }

  async getUniversity(university_id: string) {
    await this.universityService.getUniversity(university_id).subscribe(async universityRes => {
      this.university = universityRes.payload.data() as University;
      if (this.university.image !== undefined) {
        this.afStorage.storage.ref(this.university.image).getDownloadURL().then(url => {
          this.universityImg = url;
        });
      }
      this.facultyService.getFacultyByUniversityId(university_id).subscribe(fct => {
        this.listFaculty = new Array<QueryDocumentSnapshot<unknown>>();
        this.listFaculty = fct;
        this.facultyLtb = new MatTableDataSource<QueryDocumentSnapshot<unknown>>(this.listFaculty);
        this.facultyLtb.paginator = this.paginator;
        this.showTable = this.facultyLtb.data.length === 0 ? false : true;
      })
      this.showContent = this.university === undefined ? false : true;
    });
  }

  openEditUniversityDialog(): void {
    const dialogRef = this.dialog.open(EditUniversityDialogComponent, {
      width: '60%',
      data: { universityId: this.university_id, university: this.university },
    });

    dialogRef.afterClosed().subscribe(universityRs => {
      this.universityService.updateUniversity(this.university_id, universityRs);
    });
  }

  openDeleteUniversityDialog() {
    this.universityService.deleteUniversity(this.university_id);
    this.router.navigate(['/admin/list-university/']);
  }

  openAddMajorDialog(faculty: QueryDocumentSnapshot<unknown>) {
    console.log(faculty);
    const dialogRef = this.dialog.open(AddMajorDialogComponent, {
      width: '50%',
      data: faculty.id,
    });

    dialogRef.afterClosed().subscribe();
  }

  openAddEditFacultyDialog(faculty?: Faculty): void {
    const dialogRef = this.dialog.open(AddEditFacultyDialogComponent, {
      width: '50%',
      data: faculty ? faculty : null,
    });

    dialogRef.afterClosed().subscribe(facultyRs => {
      if (facultyRs.faculty !== null) {
        if (facultyRs.mode === 'เพิ่ม') {
          this.facultyService.addFaculty(this.university_id, facultyRs.faculty);
        } else if (facultyRs.mode === 'แก้ไข') {
          this.facultyService.updateFaculty(this.university_id, facultyRs.faculty);
        }
      }
    });
  }

  openDeleteFacultyDialog(faculty: QueryDocumentSnapshot<unknown>) {
    this.facultyService.deleteFaculty(faculty);
  }

  openListMajorDialog(faculty: QueryDocumentSnapshot<unknown>): void {
    const dialogRef = this.dialog.open(ListMajorDialogComponent, {
      width: '50%',
      data: faculty,
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }
}