import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-university',
  templateUrl: './list-university.component.html',
  styleUrls: ['./list-university.component.css']
})
export class ListUniversityTeacherComponent implements OnInit, OnDestroy {
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

  async ngOnInit() {
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

  onUniversityClick(university: string) {
    this.router.navigate(['/teacher/list-university/view-university', { university: university }]);
  }
}
