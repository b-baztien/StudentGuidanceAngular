import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Faculty } from 'src/app/model/Faculty';
import { MatTableDataSource, MatPaginator, MatDialog, MatPaginatorIntl } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FacultyService } from 'src/app/services/faculty-service/faculty.service';
import { DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ConfirmDialogComponent } from '../../util/confirm-dialog/confirm-dialog.component';
import { Notifications } from '../../util/notification';
import { ListMajorTeacherDialogComponent } from './dialog/list-major-dialog/list-major-dialog.component';



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
  university: University = new University;
  university_id;

  universityImg: string = 'assets/img/no-photo-available.png';

  showContent: boolean = false;
  showTable: boolean = false;

  facultyLtb: MatTableDataSource<Faculty>;
  displayedColumns: string[] = ['faculty_name', 'url', 'major'];
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

  ngAfterViewInit() {
    this.customTextPaginator();
    this.paginator._intl = this.paginatorInit;
    this.customFilter();
  }

  private customFilter() {
    this.facultyLtb.filterPredicate = (data: Faculty, filter: string) => {
      if (data.faculty_name.indexOf(filter) != -1 ||
        data.url.indexOf(filter) != -1
      ) {
        return true;
      }
      return false;
    }
  }

  private customTextPaginator() {
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
  }

  private getUniversity(university_id: string) {
    this.universityService.getUniversity(university_id).subscribe(async universityRes => {
      this.university = universityRes.payload.data() as University;
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
    this.facultyLtb = new MatTableDataSource<Faculty>();
    this.facultyService.getFacultyByUniversityId(university_id).subscribe(docs => {
      this.facultyLtb.data = docs
        .map(item => {
          return {
            id: item.id,
            ref: item.ref,
            ...item.data() as Faculty
          };
        });
      this.facultyLtb.paginator = this.paginator;
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

  openListMajorDialog(faculty: DocumentReference) {
    const dialogRef = this.dialog.open(ListMajorTeacherDialogComponent, {
      width: '90%',
      maxHeight: '90%',
      data: faculty,
    });

    dialogRef.afterClosed();
  }
}