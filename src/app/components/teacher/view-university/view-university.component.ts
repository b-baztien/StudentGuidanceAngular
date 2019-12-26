import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryDocumentSnapshot, QuerySnapshot, DocumentData, DocumentReference } from '@angular/fire/firestore';
import { University } from 'src/app/model/University';
import { MatTableDataSource, MatPaginator, MatDialog, MatPaginatorIntl } from '@angular/material';
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

  university_id: string;

  universityImg: string = 'assets/img/no-photo-available.png';

  showContent: boolean = false;
  showTable: boolean = false;

  facultyLtb: MatTableDataSource<DocumentData>;
  displayedColumns: string[] = ['faculty_name', 'url', 'major'];

  paginatorInit = new MatPaginatorIntl;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private universityService: UniversityService,
    private facultyService: FacultyService,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.university_id = this.activeRoute.snapshot.paramMap.get('university');
    if (this.university_id === null) {
      window.location.replace('/admin');
    }
  }

  async ngAfterViewInit() {

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

    this.getUniversity(this.university_id);
    this.getFaculty(this.university_id);
  }

  private getUniversity(university_id: string) {
    this.universityService.getUniversity(university_id).subscribe(async universityRes => {
      this.university = universityRes.data() as University;
      if (this.university.image !== undefined) {
        this.afStorage.storage.ref(this.university.image).getDownloadURL().then(url => {
          this.universityImg = url;
        });
      }
    });
  }

  applyFilter(filterValue: string) {
    this.facultyLtb.filter = filterValue.trim().toLowerCase();
  }

  private getFaculty(university_id: string) {
    this.facultyService.getFacultyByUniversityId(university_id).subscribe(fct => {
      this.facultyLtb = new MatTableDataSource<QueryDocumentSnapshot<unknown>>(fct.docs);
      this.facultyLtb.paginator = this.paginator;
      if (this.facultyLtb.data.length === 0) {
        this.showTable = false;
      } else {
        this.showTable = true;
      }
    })
    if (this.university === undefined) {
      this.showContent = false;
    } else {
      this.showContent = true;
    }
  }

  async openListMajorDialog(faculty: DocumentReference): Promise<void> {
    this.dialog.open(ListMajorTeacherDialogComponent, {
      width: '50%',
      data: (await faculty.collection('Major').get()).docs,
    });
  }
}
