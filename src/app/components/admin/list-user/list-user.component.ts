import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AddUserDialogComponent } from './dialog/add-user-dialog/add-user-dialog.component';
import { TeacherService } from 'src/app/services/teacher-service/teacher.service';
import { LoginService } from 'src/app/services/login-service/login.service';
import { Login } from 'src/app/model/Login';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit, AfterViewInit {
  userList: MatTableDataSource<QueryDocumentSnapshot<Object>>;
  displayedColumns: string[] = ['username', 'type', 'manage'];

  resultsLength = 0;
  isLoadingResults = true;

  listUniObs;

  showTable: boolean = false;

  constructor(public dialog: MatDialog, private router: Router, private loginService: LoginService, private teacherService: TeacherService) { }

  ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
    this.listUniObs = await this.loginService.getAllLogin().subscribe(result => {
      let resultListUser = new Array<QueryDocumentSnapshot<Object>>();
      result.forEach(element => {
        let login: Login = element.payload.doc.data() as Login;
        if (login.type != 'admin') {
          resultListUser.push(element.payload.doc);
        }
      });
      this.userList = new MatTableDataSource<QueryDocumentSnapshot<Object>>(resultListUser);
      this.showTable = this.userList.data.length === 0 ? false : true;
    });
  }

  applyFilter(filterValue: string) {
    this.userList.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.listUniObs.unsubscribe();
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '60%',
    });

    dialogRef.beforeClose().subscribe()

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  deleteUser(user: Login, login: DocumentReference) {
    this.loginService.removeUser(user, login);
  }
}
