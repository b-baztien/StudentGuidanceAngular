import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatPaginatorIntl,
  MatTableDataSource,
} from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from "rxjs";
import { Career } from "src/app/model/Career";
import { CareerService } from "src/app/services/career-service/career.service";
import { ConfirmDialogComponent } from "../../util/confirm-dialog/confirm-dialog.component";
import { Notifications } from "../../util/notification";
import { AddEditCareerDialogComponent } from "./dialog/add-edit-career-dialog/add-edit-career-dialog.component";

@Component({
  selector: "app-list-career",
  templateUrl: "./list-career.component.html",
  styleUrls: ["./list-career.component.css"],
})
export class ListCareerComponent implements OnInit, AfterViewInit, OnDestroy {
  careerList: MatTableDataSource<Career>;
  displayedColumns: string[] = ["career_name", "manage"];

  resultsLength = 0;
  isLoadingResults = true;

  paginatorInit = new MatPaginatorIntl();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  showTable: boolean = false;

  careerSub: Subscription;

  constructor(
    public dialog: MatDialog,
    private careerService: CareerService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);

    this.careerList = new MatTableDataSource<Career>();
    this.customFilter();
    //add data to table datasource
    this.careerSub = this.careerService.getAllCareer().subscribe((result) => {
      this.careerList.data = result.map((career) => {
        return { id: career.id, ref: career.ref, ...(career.data() as Career) };
      });
      this.careerList.paginator = this.paginator;

      if (this.careerList.data.length === 0) {
        this.showTable = false;
      } else {
        this.spinner.hide();
        this.showTable = true;
      }
    });
  }

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
  }

  ngOnDestroy(): void {
    this.careerSub.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.careerList.filter = filterValue.trim().toLowerCase();
  }

  private customFilter() {
    this.careerList.filterPredicate = (data: Career, filter: string) => {
      if (data.career_name.indexOf(filter) != -1) {
        return true;
      }
      return false;
    };
  }

  openAddEditCareerDialog(career?: Career): void {
    const dialogRef = this.dialog.open(AddEditCareerDialogComponent, {
      width: "90%",
      maxHeight: "90%",
      data: career ? career : null,
    });

    dialogRef.afterClosed().subscribe((dialogRs) => {
      try {
        if (dialogRs === undefined || dialogRs === null) return;
        if (dialogRs.mode === "เพิ่ม") {
          this.careerService.addCareer(dialogRs.career);
          new Notifications().showNotification(
            "done",
            "top",
            "right",
            "เพิ่มข้อมูลอาชีพสำเร็จแล้ว",
            "success",
            "สำเร็จ !"
          );
        } else if (dialogRs.mode === "แก้ไข") {
          this.careerService.updateCareer(dialogRs.career);
          new Notifications().showNotification(
            "done",
            "top",
            "right",
            "แก้ไขข้อมูลอาชีพสำเร็จแล้ว",
            "success",
            "สำเร็จ !"
          );
        }
      } catch (error) {
        console.error(error);
        new Notifications().showNotification(
          "close",
          "top",
          "right",
          error.message,
          "danger",
          "จัดการข้อมูลล้มเหลว !"
        );
      }
    });
  }

  openDeleteCareerDialog(career: Career) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "auto",
      data: `คุณต้องการลบข้อมูลอาชีพ ${career.career_name} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          await this.careerService.deleteCareer(career.ref);
          new Notifications().showNotification(
            "done",
            "top",
            "right",
            "ลบข้อมูลอาชีพสำเร็จแล้ว",
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
}
