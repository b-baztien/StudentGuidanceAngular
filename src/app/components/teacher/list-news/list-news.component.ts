import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { DocumentReference } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NewsService } from 'src/app/services/news-service/news.service';
import { AddNewsDialogComponent } from './dialog/add-news-dialog/add-news-dialog.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { News } from 'src/app/model/News';
import { EditNewsDialogComponent } from './dialog/edit-news-dialog/edit-news-dialog.component';
import { Login } from 'src/app/model/Login';
import { TeacherService } from 'src/app/services/teacher-service/teacher.service';
import { Teacher } from 'src/app/model/Teacher';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-news',
  templateUrl: './list-news.component.html',
  styleUrls: ['./list-news.component.css']
})
export class ListNewsComponent implements OnInit, OnDestroy {
  newsList: News[] = [];
  displayedColumns: string[] = ['topic', 'detail', 'start_time', 'end_time'];

  teacher: Teacher;

  resultsLength = 0;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listNewsObs: Subscription;

  imagePath = new Map();

  showContent: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private newsService: NewsService,
    private afStorage: AngularFireStorage,
    private teacherService: TeacherService
  ) { }

  ngOnInit() {
    let login: Login = JSON.parse(localStorage.getItem('userData')) as Login;
    this.listNewsObs = this.teacherService.getTeacherByUsername(login.username).subscribe(teacher => {
      this.teacher = teacher;
      this.newsService.getNewsByTeacherReference(teacher.ref).subscribe(news => {
        this.newsList = news;
        news.forEach(item => {
          if (item.image !== undefined) {
            this.afStorage.storage.ref(item.image).getDownloadURL().then(url => {
              this.imagePath.set(item.id, url);
            });
          } else {
            this.imagePath.set(item.id, 'assets/img/no-photo-available.png');
          }
          return item;
        });

        if (this.newsList.length === 0) {
          this.showContent = false;
        } else {
          this.showContent = true;
        }
      });
    });
  }

  ngOnDestroy() {
    this.listNewsObs.unsubscribe();
  }

  openAddNewsDialog(): void {
    const dialogRef = this.dialog.open(AddNewsDialogComponent, {
      width: '90%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(async news => {
      this.newsService.addNews(this.teacher.ref, news);
    });
  }

  openEditNewsDialog(news: DocumentReference): void {
    const dialogRef = this.dialog.open(EditNewsDialogComponent, {
      width: '60%',
      data: news,
    });

    dialogRef.beforeClose().subscribe()

    dialogRef.afterClosed().subscribe(() => {
    });
  }


  openDeleteNewsDialog(newsId: string) {
    this.newsService.deleteNews(newsId);
  }

  onNewsClick(news_id: string) {
    this.router.navigate(['/teacher/list-news/view-news', { news_id: news_id }]);
  }
}
