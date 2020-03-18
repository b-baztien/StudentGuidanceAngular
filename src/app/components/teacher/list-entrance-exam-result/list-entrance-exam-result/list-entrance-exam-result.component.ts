import { Component, OnInit, ViewChild } from "@angular/core";
import { QueryDocumentSnapshot } from "@angular/fire/firestore";
import { FormControl } from "@angular/forms";
import {
  MatDialog,
  MatPaginator,
  MatPaginatorIntl,
  MatTableDataSource
} from "@angular/material";
import { Router } from "@angular/router";
import { ConfirmDialogComponent } from "src/app/components/util/confirm-dialog/confirm-dialog.component";
import { Notifications } from "src/app/components/util/notification";
import { Faculty } from "src/app/model/Faculty";
import { Major } from "src/app/model/Major";
import { Teacher } from "src/app/model/Teacher";
import { EntranceExamResultService } from "src/app/services/entrance-exam-result-service/entrance-exam-result.service";
import { FacultyService } from "src/app/services/faculty-service/faculty.service";
import { MajorService } from "src/app/services/major-service/major.service";
import { TeacherService } from "src/app/services/teacher-service/teacher.service";
import { UniversityService } from "src/app/services/university-service/university.service";
import { EntranceExamResult } from "./../../../../model/EntranceExamResult";

@Component({
  selector: "app-list-entrance-exam-result",
  templateUrl: "./list-entrance-exam-result.component.html",
  styleUrls: ["./list-entrance-exam-result.component.css"]
})
export class ListEntranceExamResultComponent implements OnInit {
  examResultList: MatTableDataSource<EntranceExamResult>;
  studyUniList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  juniorSchoolList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  mapUniData: Map<string, string> = new Map<string, string>();

  displayedResultExamColumns: string[] = [
    "student",
    "entrance_exam_name",
    "year",
    "major",
    "faculty",
    "university",
    "manage"
  ];
  displayedStudyUniColumns: string[] = [
    "alumni_name",
    "graduated_year",
    "status",
    "job",
    "manage"
  ];
  displayedJuniorSchoolColumns: string[] = [
    "student_name",
    "junior_school",
    "manage"
  ];

  teacher: Teacher;

  resultsLength = 0;
  isLoadingResults = true;

  paginatorInit = new MatPaginatorIntl();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  showExamResultTable: boolean = false;
  showStudyUniTable: boolean = false;

  examResultName = new FormControl();
  toppingList: string[] = [
    "Portfolio",
    "รับตรงร่วมกัน (+กสพท)",
    "การรับแบบแอดมิชชัน",
    "การรับตรงอิสระ"
  ];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private entranceExamResuleService: EntranceExamResultService,
    private teacherService: TeacherService,
    private universityService: UniversityService,
    private facultyService: FacultyService,
    private majorService: MajorService
  ) {}

  ngOnInit() {}

  async ngAfterViewInit() {
    //custom text paginator
    this.paginatorInit.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 จากทั้งหมด ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} จากทั้งหมด ${length}`;
    };
    this.paginatorInit.changes.next();
    this.paginator._intl = this.paginatorInit;

    //add data to table datasource
    //get university data
    this.universityService.getAllUniversity().subscribe(result => {
      result.forEach(universityRef => {
        let university = universityRef;
        this.mapUniData.set(universityRef.id, university.university_name);
      });
    });

    //get faculty data
    this.facultyService.getAllFaculty().subscribe(result => {
      result.forEach(facultyRef => {
        let faculty = facultyRef.payload.doc.data() as Faculty;
        this.mapUniData.set(facultyRef.payload.doc.id, faculty.faculty_name);
      });
    });

    //get major data
    this.majorService.getAllMajor().subscribe(result => {
      result.forEach(majorRef => {
        let major = majorRef.payload.doc.data() as Major;
        this.mapUniData.set(majorRef.payload.doc.id, major.majorName);
      });
    });

    //get exam result data
    this.entranceExamResuleService
      .getAllExamResultBySchoolName(localStorage.getItem("school"))
      .subscribe(async result => {
        this.showExamResultTable = false;
        this.examResultList = new MatTableDataSource<EntranceExamResult>(
          result
        );

        //Student Data
        let resultListJunior = new Array<QueryDocumentSnapshot<Object>>();
        this.juniorSchoolList = new MatTableDataSource<
          QueryDocumentSnapshot<Object>
        >(resultListJunior);

        for (let i = 0; i < result.length; i++) {
          if (i == result.length - 1) {
            if (this.examResultList.data.length === 0) {
              this.showExamResultTable = false;
            } else {
              this.showExamResultTable = true;
            }
          }
        }
        this.juniorSchoolList.paginator = this.paginator;
        this.examResultList.paginator = this.paginator;
      });

    //get alumni data
    // (await this.alumniService.getAlumniBySchoolReference(this.teacher.ref)).subscribe(async result => {
    //   this.showStudyUniTable = false;
    //   let resultListStudy = new Array<QueryDocumentSnapshot<Object>>();
    //   this.studyUniList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(resultListStudy);
    //   for (let i = 0; i < result.length; i++) {
    //     let studyResult = result[i].data() as Alumni;
    //     if (this.teacher.school.id == studyResult.school.id) {
    //       resultListStudy.push(result[i]);
    //     }
    //     if (i == result.length - 1) {
    //       if (this.examResultList.data.length === 0) {
    //         this.showStudyUniTable = false;
    //       } else {
    //         this.showStudyUniTable = true;
    //       }
    //     }
    //   }
    //   this.examResultList.paginator = this.paginator;
    // });
  }

  openDeleteEntranceExamResuleDialog(
    entranceExamResule: QueryDocumentSnapshot<unknown>
  ) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "40%",
      data: `คุณต้องการลบข้อมูลการสอบติดนี้ ใช่ หรือ ไม่ ?`
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        if (result) {
          this.entranceExamResuleService.deleteEntranceExamResult(
            entranceExamResule.id
          );
          new Notifications().showNotification(
            "done",
            "top",
            "right",
            "ลบข้อมูลคณะสำเร็จแล้ว",
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

  applyFilter(filterValue: string) {
    this.examResultList.filter = filterValue.trim().toLowerCase();
  }

  onUniversityClick(university: string) {
    this.router.navigate([
      "/admin/list-university/view-university",
      { university: university }
    ]);
  }
}
