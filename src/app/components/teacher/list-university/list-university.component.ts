import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-university',
  templateUrl: './list-university.component.html',
  styleUrls: ['./list-university.component.css']
})
export class ListUniversityTeacherComponent implements OnInit, AfterViewInit, OnDestroy {
  universityList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  displayedColumns: string[] = ['university_name', 'phone_no', 'url', 'view', 'province', 'zone'];

  resultsLength = 0;
  isLoadingResults = true;

  paginatorInit = new MatPaginatorIntl;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listUniObs;

  showTable: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private universityService: UniversityService
  ) { }

  async ngOnInit() { }

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

    this.listUniObs = this.universityService.getAllUniversity().subscribe(result => {
      let resultListUniversity = new Array<QueryDocumentSnapshot<Object>>();
      this.universityList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(resultListUniversity);
      result.forEach(element => {
        resultListUniversity.push(element);
      });
      this.universityList.paginator = this.paginator;
      this.showTable = this.universityList.data.length === 0 ? false : true;
    });
  }

  ngOnDestroy() {
    this.listUniObs.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.universityList.filter = filterValue.trim().toLowerCase();
  }

  onUniversityClick(university: string) {
    this.router.navigate(['/teacher/list-university/view-university', { university: university }]);
  }
}
