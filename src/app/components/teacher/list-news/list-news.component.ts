import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NewsService } from 'src/app/services/news-service/news.service';
import { AddNewsDialogComponent } from './dialog/add-news-dialog/add-news-dialog.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { News } from 'src/app/model/News';

@Component({
  selector: 'app-list-news',
  templateUrl: './list-news.component.html',
  styleUrls: ['./list-news.component.css']
})
export class ListNewsComponent implements OnInit, AfterViewInit {
  newsList;
  displayedColumns: string[] = ['topic', 'detail', 'start_time', 'end_time'];

  resultsLength = 0;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listNewsObs;

  imagePath = new Map();

  showContent: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private newsService: NewsService,
    private afStorage: AngularFireStorage,
  ) {
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.listNewsObs = await this.newsService.getAllNews().subscribe(result => {
      let resultListUniversity = new Array<QueryDocumentSnapshot<Object>>();
      result.forEach(element => {
        let news = element.payload.doc.data() as News;
        if (news.image !== undefined) {
          this.afStorage.storage.ref(news.image).getDownloadURL().then(url => {
            this.imagePath.set(element.payload.doc.id, url);
          });
        } else {
          this.imagePath.set(element.payload.doc.id, 'assets/img/no-photo-available.png');
        }

        resultListUniversity.push(element.payload.doc);
      });
      this.newsList = resultListUniversity;
      this.showContent = this.newsList.length === 0 ? false : true;
    });
  }

  ngOnDestroy() {
    this.listNewsObs.unsubscribe();
  }

  openAddUniversityDialog(): void {
    const dialogRef = this.dialog.open(AddNewsDialogComponent, {
      width: '50%',
    });

    dialogRef.beforeClose().subscribe()

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  onNewsClick(news_id: string) {
    this.router.navigate(['/teacher/list-news/view-news', { news_id: news_id }]);
  }
}
