import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatPaginatorIntl } from '@angular/material';
import { QueryDocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { AddUserDialogComponent } from './dialog/add-user-dialog/add-user-dialog.component';
import { LoginService } from 'src/app/services/login-service/login.service';
import { Login } from 'src/app/model/Login';
import { ConfirmDialogComponent } from '../../util/confirm-dialog/confirm-dialog.component';
import { Notifications } from '../../util/notification';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit, AfterViewInit {
  userList: MatTableDataSource<Login>;
  displayedColumns: string[] = ['username', 'type', 'manage'];

  resultsLength = 0;

  listUniObs;

  showTable: boolean = false;

  paginatorInit = new MatPaginatorIntl;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.userList = new MatTableDataSource<Login>();
    this.customFilter();
    const storageLogin: Login = JSON.parse(localStorage.getItem('userData'))
    this.listUniObs = this.loginService.getAllLogin().subscribe(logins => {
      let newLogins = logins.filter(login => login.username !== storageLogin.username);
      this.userList.data = newLogins;
      this.userList.paginator = this.paginator;
      if (this.userList.data.length === 0) {
        this.showTable = false;
      } else {
        this.showTable = true;
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
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
  }

  private customFilter() {
    this.userList.filterPredicate = (data: Login, filter: string) => {
      if (data.username.indexOf(filter) != -1 ||
        data.type.indexOf(filter) != -1
      ) {
        return true;
      }
      return false;
    }
  }

  applyFilter(filterValue: string) {
    this.userList.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.listUniObs.unsubscribe();
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '90%',
      height: '90%',
      maxHeight: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  deleteUser(user: Login, login: DocumentReference) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: 'auto',
      maxHeight: '90%',
      data: `คุณต้องการลบผู้ใช้ ${login.id} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        if (result) {
          this.loginService.removeUser(user, login);
          new Notifications().showNotification('done', 'top', 'right', 'ลบข้อมูลผู้ใช้สำเร็จแล้ว', 'success', 'สำเร็จ !');
        }
      } catch (error) {
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'ลบข้อมูลล้มเหลว !');
      }
    });
  }
}
