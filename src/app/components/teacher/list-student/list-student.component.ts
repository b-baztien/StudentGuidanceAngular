import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Teacher } from 'src/app/model/Teacher';
import { School } from 'src/app/model/School';
import { SchoolService } from 'src/app/services/school-service/school.service';
import { TeacherService } from 'src/app/services/teacher-service/teacher.service';
import { StudentService } from 'src/app/services/student-service/student.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Student } from 'src/app/model/Student';
import { Login } from 'src/app/model/Login';
import { AlumniService } from 'src/app/services/alumni-service/alumni.service';

@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css']
})
export class ListStudentComponent implements OnInit, AfterViewInit {
  teacher: Teacher = new Teacher();
  school: School;
  studentList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  alumniList: MatTableDataSource<QueryDocumentSnapshot<Object>>;

  displayedColumns: string[] = ['select', 'fullname', 'email', 'phone_no', 'gender', 'entry_year', 'manage'];
  displayedAlumniColumns: string[] = ['fullname', 'email', 'phone_no', 'gender', 'entry_year'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listUniObs;

  showContent = false;
  showStudentTable: boolean = false;
  showAlumniTable: boolean = false;

  selection = new SelectionModel<QueryDocumentSnapshot<Object>>(true, []);

  constructor(
    public dialog: MatDialog,
    private studentService: StudentService,
    private alumniService: AlumniService,
    private schoolService: SchoolService,
    private teacherService: TeacherService,
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    let login: Login = JSON.parse(localStorage.getItem('userData')) as Login;
    this.teacherService.getTeacherByUsername(login.username).subscribe(teacherRef => {
      this.showContent = true;
      this.teacher = { id: teacherRef.id, ref: teacherRef.ref, ...teacherRef.data() as Teacher };
      this.schoolService.getSchool(this.teacher.ref.parent.parent.id).subscribe(schoolRef => {
        this.school = { id: schoolRef.id, ref: schoolRef.ref, ...schoolRef.data() as School };
        this.showContent = true;
        this.getStudentData(this.school);
        this.getAlumniData(this.school);
      });
    });
  }

  private getStudentData(school: School) {
    this.studentService.getStudentBySchoolReference(school.ref).subscribe(listStdRef => {
      this.studentList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(listStdRef);
      this.studentList.paginator = this.paginator;
      if (this.studentList.data.length === 0) {
        this.showStudentTable = false;
      } else {
        this.showStudentTable = true;
      }
    });
  }

  private getAlumniData(school: School) {
    this.alumniService.getAlumniBySchoolReference(school.ref).subscribe(listAlnRef => {
      this.alumniList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(listAlnRef);
      this.alumniList.paginator = this.paginator;
      if (this.alumniList.data.length === 0) {
        this.showAlumniTable = false;
      } else {
        this.showAlumniTable = true;
      }
    });
  }

  applyStudentFilter(filterValue: string) {
    this.studentList.filter = filterValue.trim().toLowerCase();
  }

  applyAlumniFilter(filterValue: string) {
    this.alumniList.filter = filterValue.trim().toLowerCase();
  }

  openAddStudentDialog(): void {
  }

  onStudentClick(id: string) {
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
