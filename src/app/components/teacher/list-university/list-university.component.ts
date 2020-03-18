import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatPaginatorIntl } from '@angular/material';
import { Router } from '@angular/router';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { University } from 'src/app/model/University';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-university',
  templateUrl: './list-university.component.html',
  styleUrls: ['./list-university.component.css'],
})
export class ListUniversityTeacherComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['university_name', 'phone_no', 'url', 'view', 'province', 'zone'];
  universityList: MatTableDataSource<University>;

  resultsLength = 0;
  isLoadingResults = true;

  paginatorInit = new MatPaginatorIntl;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  uniSub: Subscription;

  showTable: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private universityService: UniversityService
  ) { }

  ngOnInit() {
    this.universityList = new MatTableDataSource<University>();
    this.customFilter();
    //add data to table datasource
    this.uniSub = this.universityService.getAllUniversity().subscribe(university => {
      this.universityList.data = university;
      if (this.universityList.data.length === 0) {
        this.showTable = false;
      } else {
        this.showTable = true;
      }

      this.universityList.paginator = this.paginator;
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
    });
  }

  ngOnDestroy() {
    this.uniSub.unsubscribe();
  }

  private customFilter() {
    this.universityList.filterPredicate = (data: University, filter: string) => {
      if (data.university_name.indexOf(filter) != -1 ||
        data.phone_no.indexOf(filter) != -1 ||
        data.province.indexOf(filter) != -1 ||
        data.zone.indexOf(filter) != -1
      ) {
        return true;
      }
      return false;
    }
  }

  applyFilter(filterValue: string) {
    this.universityList.filter = filterValue.trim().toLowerCase();
  }

  onUniversityClick(university: string) {
    this.router.navigate(['/teacher/list-university/view-university', { university: university }]);
  }
}
