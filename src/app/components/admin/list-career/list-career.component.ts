import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginatorIntl, MatPaginator, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AddEditCareerDialogComponent } from './dialog/add-edit-career-dialog/add-edit-career-dialog.component';
import { Notifications } from '../../util/notification';
import { Career } from 'src/app/model/Career';
import { ConfirmDialogComponent } from '../../util/confirm-dialog/confirm-dialog.component';
import { CareerService } from 'src/app/services/career-service/career.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-career',
  templateUrl: './list-career.component.html',
  styleUrls: ['./list-career.component.css']
})
export class ListCareerComponent implements OnInit, AfterViewInit, OnDestroy {
  careerList: MatTableDataSource<QueryDocumentSnapshot<DocumentData>>;
  displayedColumns: string[] = ['career_name', 'manage'];

  resultsLength = 0;
  isLoadingResults = true;

  paginatorInit = new MatPaginatorIntl;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  showTable: boolean = false;

  careerSub: Subscription;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private careerService: CareerService
  ) { }

  ngOnInit() {
    //add data to table datasource
    this.careerSub = this.careerService.getAllCareer().subscribe(result => {
      this.careerList = new MatTableDataSource<QueryDocumentSnapshot<DocumentData>>(result.map(career => career.payload.doc));
      this.careerList.paginator = this.paginator;

      if (this.careerList.data.length === 0) {
        this.showTable = false;
      } else {
        this.showTable = true
      }
    });
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
  }

  ngOnDestroy(): void {
    this.careerSub.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.careerList.filter = filterValue.trim().toLowerCase();
  }

  openAddEditCareerDialog(career?: QueryDocumentSnapshot<unknown>): void {
    const dialogRef = this.dialog.open(AddEditCareerDialogComponent, {
      width: '90%',
      maxHeight: '90%',
      data: career ? career.data() as Career : null,
    });

    dialogRef.afterClosed().subscribe(careerRs => {
      try {
        if (careerRs === undefined || careerRs === null) return;
        if (careerRs.mode === 'เพิ่ม') {
          this.careerService.addCareer(careerRs.career);
          new Notifications().showNotification('done', 'top', 'right', 'เพิ่มข้อมูลอาชีพสำเร็จแล้ว', 'success', 'สำเร็จ !');
        } else if (careerRs.mode === 'แก้ไข') {
          this.careerService.updateCareer(careerRs.career);
          new Notifications().showNotification('done', 'top', 'right', 'แก้ไขข้อมูลอาชีพสำเร็จแล้ว', 'success', 'สำเร็จ !');
        }
      } catch (error) {
        console.error(error);
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'จัดการข้อมูลล้มเหลว !');
      }
    });
  }

  openDeleteCareerDialog(career: QueryDocumentSnapshot<unknown>) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: 'auto',
      data: `คุณต้องการลบข้อมูลอาชีพ${(career.data() as Career).career_name} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        if (result) {
          this.careerService.deleteCareer(career);
          new Notifications().showNotification('done', 'top', 'right', 'ลบข้อมูลอาชีพสำเร็จแล้ว', 'success', 'สำเร็จ !');
        }
      } catch (error) {
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'ลบข้อมูลล้มเหลว !');
      }
    });
  }
}
