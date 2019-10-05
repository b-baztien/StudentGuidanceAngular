import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NewsService } from 'src/app/services/news-service/news.service';
import { AddNewsDialogComponent } from './dialog/add-news-dialog/add-news-dialog.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { News } from 'src/app/model/News';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { University } from 'src/app/model/University';
import { EditNewsDialogComponent } from './dialog/edit-news-dialog/edit-news-dialog.component';

@Component({
  selector: 'app-list-news',
  templateUrl: './list-news.component.html',
  styleUrls: ['./list-news.component.css']
})
export class ListNewsComponent implements OnInit, AfterViewInit {
  newsList;
  displayedColumns: string[] = ['topic', 'detail', 'start_time', 'end_time'];

  resultsLength = 0;

  mapUniversity = new Map();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listNewsObs;

  imagePath = new Map();

  showContent: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private newsService: NewsService,
    private universityService: UniversityService,
    private afStorage: AngularFireStorage,
  ) {
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.listNewsObs = await this.newsService.getAllNews().subscribe(() => {
      this.newsService.getAllNewsOrderByDate().then(result => {
        let resultListUniversity = new Array<QueryDocumentSnapshot<Object>>();
        result.forEach(element => {
          let news = element.data() as News;
          if (news.image !== undefined) {
            this.afStorage.storage.ref(news.image).getDownloadURL().then(url => {
              this.imagePath.set(element.id, url);
            });
          } else {
            this.imagePath.set(element.id, 'assets/img/no-photo-available.png');
          }
          let listUniName = new Array<string>();
          if (news.university !== undefined) {
            news.university.forEach(uniRef => {
              this.universityService.getUniversity(uniRef.id).subscribe(result => {
                let uni = result.payload.data() as University;
                listUniName.push(uni.university_name);
                if (listUniName.length === news.university.length) {
                  this.mapUniversity.set(element.id, listUniName);
                }
              });
            });
          } else {
            this.mapUniversity.set(element.id, null);
          }

          resultListUniversity.push(element);
        });
        this.newsList = resultListUniversity;
        this.showContent = this.newsList.length === 0 ? false : true;
      });
    });
  }

  ngOnDestroy() {
    this.listNewsObs.unsubscribe();
  }

  openAddNewsDialog(): void {
    const dialogRef = this.dialog.open(AddNewsDialogComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  openEditNewsDialog(news: DocumentReference): void {
    const dialogRef = this.dialog.open(EditNewsDialogComponent, {
      width: '60%',
      data: news,
    });

    dialogRef.beforeClose().subscribe()

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }


  openDeleteNewsDialog(newsId: string) {
    this.newsService.deleteNews(newsId);
  }

  onNewsClick(news_id: string) {
    this.router.navigate(['/teacher/list-news/view-news', { news_id: news_id }]);
  }
}
