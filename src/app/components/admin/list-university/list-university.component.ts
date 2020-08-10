import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  MatPaginatorIntl,
} from "@angular/material";
import { Router } from "@angular/router";
import { UniversityService } from "src/app/services/university-service/university.service";
import { AddUniversityDialogComponent } from "./dialog/add-university-dialog/add-university-dialog.component";
import { University } from "src/app/model/University";
import { Subscription } from "rxjs";

@Component({
  selector: "app-list-university",
  templateUrl: "./list-university.component.html",
  styleUrls: ["./list-university.component.css"],
})
export class ListUniversityComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "university_name",
    "phone_no",
    "url",
    "view",
    "province",
    "zone",
  ];
  universityList: MatTableDataSource<University>;

  resultsLength = 0;
  isLoadingResults = true;

  paginatorInit = new MatPaginatorIntl();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  uniSub: Subscription;

  showTable: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private universityService: UniversityService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);

    this.universityList = new MatTableDataSource<University>();
    this.customFilter();
    //add data to table datasource
    this.uniSub = this.universityService
      .getAllUniversity()
      .subscribe((universitys) => {
        this.universityList.data = universitys;
        if (this.universityList.data.length === 0) {
          this.showTable = false;
        } else {
          this.spinner.hide();
          this.showTable = true;
        }

        this.universityList.paginator = this.paginator;
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
      });
  }

  ngOnDestroy() {
    this.uniSub.unsubscribe();
  }

  private customFilter() {
    this.universityList.filterPredicate = (
      data: University,
      filter: string
    ) => {
      if (
        data.university_name.indexOf(filter) != -1 ||
        data.phone_no.indexOf(filter) != -1 ||
        data.province.indexOf(filter) != -1 ||
        data.zone.indexOf(filter) != -1
      ) {
        return true;
      }
      return false;
    };
  }

  applyFilter(filterValue: string) {
    this.universityList.filter = filterValue.trim().toLowerCase();
  }

  openAddUniversityDialog(): void {
    const dialogRef = this.dialog.open(AddUniversityDialogComponent, {
      width: "90%",
      height: "90%",
    });

    dialogRef.afterClosed().subscribe(async (universityId) => {
      if (universityId != null) {
        this.router.navigate([
          "/admin/list-university/view-university",
          { university: universityId },
        ]);
      }
    });
  }

  onUniversityClick(university: string) {
    this.router.navigate([
      "/admin/list-university/view-university",
      { university: university },
    ]);
  }
}
