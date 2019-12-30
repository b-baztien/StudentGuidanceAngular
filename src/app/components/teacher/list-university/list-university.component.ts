import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { Router } from '@angular/router';
import { University } from 'src/app/model/University';

@Component({
  selector: 'app-list-university',
  templateUrl: './list-university.component.html',
  styleUrls: ['./list-university.component.css']
})
export class ListUniversityTeacherComponent implements OnInit, AfterViewInit, OnDestroy {
  universityList: MatTableDataSource<{ id: string, value: University }>;
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
      this.universityList = new MatTableDataSource<{ id: string, value: University }>(result
        .map(uniRef => { return { id: uniRef.id, value: uniRef.data() as University } }));
      this.universityList.paginator = this.paginator;
      if (this.universityList.data.length === 0) {
        this.showTable = false;
      } else {
        this.showTable = true;
      }
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
