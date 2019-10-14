import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { AddUniversityDialogComponent } from './dialog/add-university-dialog/add-university-dialog.component';

@Component({
  selector: 'app-list-university',
  templateUrl: './list-university.component.html',
  styleUrls: ['./list-university.component.css']
})
export class ListUniversityComponent implements OnInit, OnDestroy, AfterViewInit {
  universityList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  displayedColumns: string[] = ['university_name', 'phone_no', 'url', 'view', 'province', 'zone'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listUniObs;

  showTable: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private universityService: UniversityService
  ) { }

  ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
    this.listUniObs = await this.universityService.getAllUniversity().subscribe(result => {
      let resultListUniversity = new Array<QueryDocumentSnapshot<Object>>();
      result.forEach(element => {
        resultListUniversity.push(element.payload.doc);
      });
      this.universityList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(resultListUniversity);
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

  openAddUniversityDialog(): void {
    const dialogRef = this.dialog.open(AddUniversityDialogComponent, {
      width: '50%',
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
