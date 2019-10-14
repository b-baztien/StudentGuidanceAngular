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
import { SelectionModel } from '@angular/cdk/collections';
import { Student } from 'src/app/model/Student';

@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css']
})
export class ListStudentComponent implements OnInit, AfterViewInit, OnDestroy {
  teacher: Teacher;
  school: School;
  studentList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  displayedColumns: string[] = ['select', 'fullname', 'email', 'phone_no', 'gender', 'entry_year', 'manage'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listUniObs;

  showContent = false;
  showTable: boolean = false;

  selection = new SelectionModel<QueryDocumentSnapshot<Object>>(true, []);

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

  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(AddUniversityDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(async universityId => {
      if (universityId != null) {
        this.router.navigate(['/admin/list-university/view-university', { university: universityId }]);
      }
    });
  }

  onStudentClick(university: string) {
    const dialogRef = this.dialog.open(AddUniversityDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(async universityId => {
      if (universityId != null) {
        this.router.navigate(['/admin/list-university/view-university', { university: universityId }]);
      }
    });
  }

  onChangeStudentStatus(student?: QueryDocumentSnapshot<unknown>) {
    if (student) {
      this.selection.toggle(student);
    }
    this.selection.selected.forEach(studentRef => {
      let std = studentRef.data() as Student;
      std.student_status = 'สำเร็จการศึกษา';
      this.studentService.updateStudent(studentRef.id, std);
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.studentList.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.studentList.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: QueryDocumentSnapshot<Object>): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }
}
