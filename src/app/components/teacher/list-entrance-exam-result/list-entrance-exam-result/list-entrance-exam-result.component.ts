import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginatorIntl, MatPaginator, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { EntranceExamResultService } from 'src/app/services/entrance-exam-result-service/entrance-exam-result.service';
import { FormControl } from '@angular/forms';
import { EntranceExamResult } from 'src/app/model/EntranceExamResult';
import { Major } from 'src/app/model/Major';
import { Faculty } from 'src/app/model/Faculty';
import { University } from 'src/app/model/University';
import { ConfirmDialogComponent } from 'src/app/components/util/confirm-dialog/confirm-dialog.component';
import { Notifications } from 'src/app/components/util/notification';
import { TeacherService } from 'src/app/services/teacher-service/teacher.service';
import { Login } from 'src/app/model/Login';
import { Teacher } from 'src/app/model/Teacher';

@Component({
  selector: 'app-list-entrance-exam-result',
  templateUrl: './list-entrance-exam-result.component.html',
  styleUrls: ['./list-entrance-exam-result.component.css']
})
export class ListEntranceExamResultComponent implements OnInit {
  examResultList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  mapUniData: Map<string, string> = new Map<string, string>();

  displayedColumns: string[] = ['entrance_exam_name', 'year', 'major', 'faculty', 'university', 'manage'];

  teacher: Teacher;

  resultsLength = 0;
  isLoadingResults = true;

  paginatorInit = new MatPaginatorIntl;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listExamObs;

  showTable: boolean = false;

  examResultName = new FormControl();
  toppingList: string[] = ['Portfolio', 'รับตรงร่วมกัน (+กสพท)', 'การรับแบบแอดมิชชัน', 'การรับตรงอิสระ'];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private entranceExamResuleService: EntranceExamResultService,
    private teacherService: TeacherService,
  ) { }

  ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
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

    //add data to table datasource
    let userData: Login = JSON.parse(localStorage.getItem('userData'));
    this.teacher = await this.teacherService.getTeacherByUsername(userData.username).then(result => {
      return result.data() as Teacher;
    });
    this.listExamObs = await this.entranceExamResuleService.getAllExamResult().subscribe(async result => {
      this.showTable = false;
      let resultListExam = new Array<QueryDocumentSnapshot<Object>>();
      this.examResultList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(resultListExam);
      for (let i = 0; i < result.length; i++) {
        let examResult = result[i].payload.doc.data() as EntranceExamResult;
        if (this.teacher.school.id == examResult.school.id) {
          await examResult.major.get().then(result => {
            let major = result.data() as Major;
            this.mapUniData.set(result.id, major.major_name);
          });
          await examResult.faculty.get().then(result => {
            let faculty = result.data() as Faculty;
            this.mapUniData.set(result.id, faculty.faculty_name);
          });
          await examResult.university.get().then(result => {
            let university = result.data() as University;
            this.mapUniData.set(result.id, university.university_name);
          });
          resultListExam.push(result[i].payload.doc);
        }
        if (i == result.length - 1) {
          this.showTable = this.examResultList.data.length === 0 ? false : true;
        }
      };
      this.examResultList.paginator = this.paginator;
    });
  }

  ngOnDestroy() {
    this.listExamObs.unsubscribe();
  }

  openDeleteEntranceExamResuleDialog(entranceExamResule: QueryDocumentSnapshot<unknown>) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '40%',
      data: `คุณต้องการลบข้อมูลการสอบติดนี้ ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        if (result) {
          this.entranceExamResuleService.deleteEntranceExamResult(entranceExamResule.id);
          new Notifications().showNotification('done', 'top', 'right', 'ลบข้อมูลคณะสำเร็จแล้ว', 'success', 'สำเร็จ !');
        }
      } catch (error) {
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'ลบข้อมูลล้มเหลว !');
      }
    });
  }

  applyFilter(filterValue: string) {
    this.examResultList.filter = filterValue.trim().toLowerCase();
  }

  onUniversityClick(university: string) {
    this.router.navigate(['/admin/list-university/view-university', { university: university }]);
  }
}
