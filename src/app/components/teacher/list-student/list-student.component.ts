import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { AddUniversityDialogComponent } from '../../admin/list-university/dialog/add-university-dialog/add-university-dialog.component';
import { Teacher } from 'src/app/model/Teacher';
import { School } from 'src/app/model/School';
import { SchoolService } from 'src/app/services/school-service/school.service';
import { TeacherService } from 'src/app/services/teacher-service/teacher.service';
import { StudentService } from 'src/app/services/student-service/student.service';

@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css']
})
export class ListStudentComponent implements OnInit, AfterViewInit, OnDestroy {
  teacher: Teacher;
  school: School;
  studentList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  displayedColumns: string[] = ['fullname', 'email', 'phone_no', 'gender', 'entry_year'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listUniObs;

  showContent = false;
  showTable: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private studentService: StudentService,
    private schoolService: SchoolService,
    private teacherService: TeacherService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //test Teacher
    this.teacher = new Teacher();

    this.teacherService.getTeacher('teacher1').subscribe(teacherRef => {
      this.teacher = teacherRef.payload.data() as Teacher;
      this.schoolService.getSchool(this.teacher.school.id).subscribe(schoolRef => {
        this.school = schoolRef.payload.data() as School;
        this.showContent = true;
        let resultListStudent = new Array<QueryDocumentSnapshot<Object>>();
        this.listUniObs = this.studentService.getStudentBySchoolId(schoolRef.payload.id).subscribe(listStdRef => {
          resultListStudent = listStdRef;

          this.studentList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(resultListStudent);
          this.studentList.paginator = this.paginator;
          this.showTable = this.studentList.data.length === 0 ? false : true;
        });
      });
    });
  }

  ngOnDestroy() {
    this.listUniObs.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.studentList.filter = filterValue.trim().toLowerCase();
  }

  openAddUniversityDialog(): void {
    const dialogRef = this.dialog.open(AddUniversityDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(async universityId => {
      if (universityId != null) {
        this.router.navigate(['/admin/list-university/view-university', { university: universityId }]);
      }
    });
  }

  onUniversityClick(university: string) {
    this.router.navigate(['/admin/list-university/view-university', { university: university }]);
  }
}
