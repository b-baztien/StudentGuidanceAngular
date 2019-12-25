import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginatorIntl, MatPaginator, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AddEditCareerDialogComponent } from './dialog/add-edit-career-dialog/add-edit-career-dialog.component';
import { Notifications } from '../../util/notification';
import { Career } from 'src/app/model/Career';
import { ConfirmDialogComponent } from '../../util/confirm-dialog/confirm-dialog.component';
import { CareerService } from 'src/app/services/career-service/career.service';

@Component({
  selector: 'app-list-career',
  templateUrl: './list-career.component.html',
  styleUrls: ['./list-career.component.css']
})
export class ListCareerComponent implements OnInit, AfterViewInit {
  careerList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  displayedColumns: string[] = ['career_name', 'manage'];

  resultsLength = 0;
  isLoadingResults = true;

  paginatorInit = new MatPaginatorIntl;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  showTable: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private careerService: CareerService
  ) { }

  ngOnInit() { }

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
    this.careerService.getAllCareer().subscribe(result => {
      let resultListCareer = new Array<QueryDocumentSnapshot<Object>>();
      result.forEach(element => {
        resultListCareer.push(element.payload.doc);
      });
      this.careerList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(resultListCareer);
      this.careerList.paginator = this.paginator;
      this.showTable = this.careerList.data.length === 0 ? false : true;
    });
  }

  applyFilter(filterValue: string) {
    this.careerList.filter = filterValue.trim().toLowerCase();
  }

  openAddEditCareerDialog(career?: QueryDocumentSnapshot<unknown>): void {
    const dialogRef = this.dialog.open(AddEditCareerDialogComponent, {
      width: '50%',
      data: career ? career.data() as Career : null,
    });

    dialogRef.afterClosed().subscribe(careerRs => {
      try {
        if (careerRs !== null) {
          if (careerRs.mode === 'เพิ่ม') {
            this.careerService.addCareer(careerRs.career);
            new Notifications().showNotification('done', 'top', 'right', 'เพิ่มข้อมูลคณะสำเร็จแล้ว', 'success', 'สำเร็จ !');
          } else if (careerRs.mode === 'แก้ไข') {
            this.careerService.updateCareer(careerRs.career);
            new Notifications().showNotification('done', 'top', 'right', 'แก้ไขข้อมูลคณะสำเร็จแล้ว', 'success', 'สำเร็จ !');
          }
        }
      } catch (error) {
        console.error(error);
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'จัดการข้อมูลล้มเหลว !');
      }
    });
  }

  openDeleteCareerDialog(career: QueryDocumentSnapshot<unknown>) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '40%',
      data: `คุณต้องการลบข้อมูลอาชีพ${(career.data() as Career).career_name} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        if (result) {
          this.careerService.deleteCareer(career);
          new Notifications().showNotification('done', 'top', 'right', 'ลบข้อมูลคณะสำเร็จแล้ว', 'success', 'สำเร็จ !');
        }
      } catch (error) {
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'ลบข้อมูลล้มเหลว !');
      }
    });
  }
}
