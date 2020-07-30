import { SelectionModel } from "@angular/cdk/collections";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { Login } from "src/app/model/Login";
import { School } from "src/app/model/School";
import { Student } from "src/app/model/Student";
import { Teacher } from "src/app/model/Teacher";
import { AlumniService } from "src/app/services/alumni-service/alumni.service";
import { SchoolService } from "src/app/services/school-service/school.service";
import { StudentService } from "src/app/services/student-service/student.service";
import { TeacherService } from "src/app/services/teacher-service/teacher.service";
import { AddStudentDialogComponent } from "./dialog/add-student-dialog/add-student-dialog.component";
import { DocumentReference } from "@angular/fire/firestore";
import { ConfirmDialogComponent } from "../../util/confirm-dialog/confirm-dialog.component";
import { Notifications } from "../../util/notification";

@Component({
  selector: "app-list-student",
  templateUrl: "./list-student.component.html",
  styleUrls: ["./list-student.component.css"],
})
export class ListStudentComponent implements OnInit, AfterViewInit {
  studentList: MatTableDataSource<Student> = new MatTableDataSource<Student>();
  alumniList: MatTableDataSource<Student> = new MatTableDataSource<Student>();

  displayedColumns: string[] = [
    "select",
    "fullname",
    "email",
    "phone_no",
    "gender",
    "entry_year",
    "manage",
  ];
  displayedAlumniColumns: string[] = [
    "fullname",
    "email",
    "phone_no",
    "gender",
    "entry_year",
    "manage",
  ];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild("stdPaginator", { static: false }) stdPaginator: MatPaginator;
  @ViewChild("alnPaginator", { static: false }) alnPaginator: MatPaginator;

  showContent = false;
  school: School = new School();
  showStudentTable: boolean = false;
  showAlumniTable: boolean = false;

  selection = new SelectionModel<Student>(true, []);

  constructor(
    public dialog: MatDialog,
    private studentService: StudentService,
    private alumniService: AlumniService,
    private schoolService: SchoolService,
    private teacherService: TeacherService
  ) {}

  ngOnInit() {
    let login: Login = JSON.parse(localStorage.getItem("userData")) as Login;
    this.teacherService
      .getTeacherByUsername(login.username)
      .subscribe((resultTeacher) => {
        this.showContent = true;
        let teacher: Teacher = resultTeacher;
        this.schoolService
          .getSchool(teacher.ref.parent.parent.id)
          .subscribe((resultSchool) => {
            this.school = resultSchool;
            this.showContent = true;
            this.getStudentData(this.school);
            this.getAlumniData(this.school);
          });
      });
  }

  ngAfterViewInit(): void {}

  private getStudentData(school: School) {
    this.studentService
      .getStudentBySchoolReference(school.ref)
      .subscribe((students) => {
        this.studentList.data = students;
        this.studentList.paginator = this.stdPaginator;
        if (this.studentList.data.length === 0) {
          this.showStudentTable = false;
        } else {
          this.showStudentTable = true;
        }
      });
  }

  private getAlumniData(school: School) {
    this.alumniService
      .getAlumniBySchoolReference(school.ref)
      .subscribe((alumnies) => {
        this.alumniList.data = alumnies;
        this.alumniList.paginator = this.alnPaginator;
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
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: "90%",
      height: "90%",
      maxHeight: "90%",
      data: this.school.ref,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  deleteStudent(student: Student) {
    const studentType: string =
      student.student_status == "กำลังศึกษา" ? "นักเรียน" : "ศิษย์เก่า";
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "auto",
      maxHeight: "90%",
      data: `คุณต้องการลบข้อมูล${studentType} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe((result) => {
      try {
        if (result) {
          this.studentService.removeStudent(student);
          new Notifications().showNotification(
            "done",
            "top",
            "right",
            "ลบข้อมูลสำเร็จแล้ว",
            "success",
            "สำเร็จ !"
          );
        }
      } catch (error) {
        new Notifications().showNotification(
          "close",
          "top",
          "right",
          error.message,
          "danger",
          "ลบข้อมูลล้มเหลว !"
        );
      }
    });
  }

  onStudentClick(student: Student) {}

  onChangeStudentStatus(student?: Student) {
    if (student) {
      this.selection.toggle(student);
    }
    this.selection.selected.forEach(async (std) => {
      std.student_status =
        std.student_status == "กำลังศึกษา" ? "สำเร็จการศึกษา" : "กำลังศึกษา";

      const studentRef: DocumentReference = std.ref;
      delete std.id;
      delete std.ref;
      await this.studentService.updateStudent(studentRef, std);
    });

    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.studentList.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.studentList.data.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(row?: Student): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${row}`;
  }
}
