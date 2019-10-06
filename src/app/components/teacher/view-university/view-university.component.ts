import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { University } from 'src/app/model/University';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { FacultyService } from 'src/app/services/faculty-service/faculty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { ListMajorTeacherDialogComponent } from './dialog/list-major-dialog/list-major-dialog.component';

@Component({
  selector: 'app-view-university',
  templateUrl: './view-university.component.html',
  styleUrls: ['./view-university.component.css']
})
export class ViewUniversityComponent implements OnInit {
  university: University;
  listFaculty: Array<QueryDocumentSnapshot<unknown>>;

  university_id: string;

  universityImg: string = 'assets/img/no-photo-available.png';

  showContent: boolean = false;
  showTable: boolean = false;

  facultyLtb: MatTableDataSource<QueryDocumentSnapshot<unknown>>;
  displayedColumns: string[] = ['faculty_name', 'url', 'major'];
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

  openListMajorDialog(faculty: QueryDocumentSnapshot<unknown>): void {
    const dialogRef = this.dialog.open(ListMajorTeacherDialogComponent, {
      width: '50%',
      data: faculty,
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }
}
