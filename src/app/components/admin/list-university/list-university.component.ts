import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatPaginatorIntl, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { AddUniversityDialogComponent } from './dialog/add-university-dialog/add-university-dialog.component';
import { University } from 'src/app/model/University';
import { Subscription } from 'rxjs';

export interface DataDisplay {
  university_name: string;
  phone_no: string;
  url: string;
  view: string;
  province: string;
  zone: string;
}

@Component({
  selector: 'app-list-university',
  templateUrl: './list-university.component.html',
  styleUrls: ['./list-university.component.css']
})
export class ListUniversityComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['university_name', 'phone_no', 'url', 'view', 'province', 'zone'];
  universityList: MatTableDataSource<DataDisplay>;

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
    //add data to table datasource
    this.uniSub = this.universityService.getAllUniversity().subscribe(docs => {
      this.universityList = new MatTableDataSource<DataDisplay>(docs
        .map(uniRef => {
          return { ...uniRef.data() as DataDisplay, id: uniRef.id };
        }));
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

  applyFilter(filterValue: string) {
    this.universityList.filter = filterValue.trim().toLowerCase();
    console.log(this.universityList.filteredData);
  }

  openAddUniversityDialog(): void {
    const dialogRef = this.dialog.open(AddUniversityDialogComponent, {
      width: '90%',
      height: '90%',
    });

    dialogRef.afterClosed().subscribe(async universityId => {
      if (universityId != null) {
        this.router.navigate(['/admin/list-university/view-university', { university: universityId }]);
      }
    });
  }

  onUniversityClick(university: string) {
    this.router.navigate(['/admin/list-university/view-university', { university: university }]);
  }
}
