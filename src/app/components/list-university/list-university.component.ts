import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { University } from 'src/app/model/University';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { Observable } from 'rxjs';
import { DocumentChangeAction, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { EventEmitter } from 'events';
import { AddUniversityDialogComponent } from './dialog/add-university-dialog/add-university-dialog.component';

@Component({
  selector: 'app-list-university',
  templateUrl: './list-university.component.html',
  styleUrls: ['./list-university.component.css']
})
export class ListUniversityComponent implements OnInit {
  universityList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  displayedColumns: string[] = ['university_name', 'phone_no', 'url', 'view', 'zone'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listUniObs;

  constructor(public dialog: MatDialog, private router: Router, private universityService: UniversityService) { }

  async ngOnInit() {
    this.listUniObs = await this.universityService.getAllUniversity().subscribe(result => {
      let resultListUniversity = new Array<QueryDocumentSnapshot<Object>>();
      result.forEach(element => {
        resultListUniversity.push(element.payload.doc);
      });
      this.universityList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(resultListUniversity);
      this.universityList.paginator = this.paginator;
    });
  }

  ngOnDestroy() {
    this.listUniObs.unsubscribe();
  }

  openAddUniversityDialog(): void {
    const dialogRef = this.dialog.open(AddUniversityDialogComponent, {
      width: '50%',
    });

    dialogRef.beforeClose().subscribe()

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  onUniversityClick(university_id: string) {
    this.router.navigate(['/admin/list-university/view-university', { university_id: university_id }]);
  }
}
