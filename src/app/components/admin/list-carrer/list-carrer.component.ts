import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginatorIntl, MatPaginator, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CarrerService } from 'src/app/services/carrer-service/carrer.service';
import { AddUniversityDialogComponent } from '../list-university/dialog/add-university-dialog/add-university-dialog.component';
import { AddEditCarrerDialogComponent } from './dialog/add-edit-carrer-dialog/add-edit-carrer-dialog.component';
import { Notifications } from '../../util/notification';
import { Carrer } from 'src/app/model/Carrer';
import { ConfirmDialogComponent } from '../../util/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-list-carrer',
  templateUrl: './list-carrer.component.html',
  styleUrls: ['./list-carrer.component.css']
})
export class ListCarrerComponent implements OnInit, AfterViewInit {
  carrerList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  displayedColumns: string[] = ['carrer_name', 'manage'];

  resultsLength = 0;
  isLoadingResults = true;

  paginatorInit = new MatPaginatorIntl;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  showTable: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private carrerService: CarrerService
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
    await this.carrerService.getAllCarrer().subscribe(result => {
      let resultListCarrer = new Array<QueryDocumentSnapshot<Object>>();
      console.log(this.carrerList);
      result.forEach(element => {
        resultListCarrer.push(element.payload.doc);
      });
      this.carrerList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(resultListCarrer);
      this.carrerList.paginator = this.paginator;
      this.showTable = this.carrerList.data.length === 0 ? false : true;
    });
  }

  applyFilter(filterValue: string) {
    this.carrerList.filter = filterValue.trim().toLowerCase();
  }

  openAddEditCarrerDialog(carrer?: QueryDocumentSnapshot<unknown>): void {
    const dialogRef = this.dialog.open(AddEditCarrerDialogComponent, {
      width: '50%',
      data: carrer ? carrer.data() as Carrer : null,
    });

    dialogRef.afterClosed().subscribe(carrerRs => {
      try {
        if (carrerRs !== null) {
          if (carrerRs.mode === 'เพิ่ม') {
            this.carrerService.addCarrer(carrerRs.carrer);
            new Notifications().showNotification('done', 'top', 'right', 'เพิ่มข้อมูลคณะสำเร็จแล้ว', 'success', 'สำเร็จ !');
          } else if (carrerRs.mode === 'แก้ไข') {
            this.carrerService.updateCarrer(carrerRs.carrer);
            new Notifications().showNotification('done', 'top', 'right', 'แก้ไขข้อมูลคณะสำเร็จแล้ว', 'success', 'สำเร็จ !');
          }
        }
      } catch (error) {
        console.error(error);
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'จัดการข้อมูลล้มเหลว !');
      }
    });
  }

  openDeleteCarrerDialog(carrer: QueryDocumentSnapshot<unknown>) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '40%',
      data: `คุณต้องการลบข้อมูลอาชีพ${(carrer.data() as Carrer).carrer_name} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        if (result) {
          this.carrerService.deleteCarrer(carrer);
          new Notifications().showNotification('done', 'top', 'right', 'ลบข้อมูลคณะสำเร็จแล้ว', 'success', 'สำเร็จ !');
        }
      } catch (error) {
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'ลบข้อมูลล้มเหลว !');
      }
    });
  }
}
