import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { MatDialog, MatPaginator } from "@angular/material";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Login } from "src/app/model/Login";
import { News } from "src/app/model/News";
import { Teacher } from "src/app/model/Teacher";
import { NewsService } from "src/app/services/news-service/news.service";
import { TeacherService } from "src/app/services/teacher-service/teacher.service";
import { ConfirmDialogComponent } from "../../util/confirm-dialog/confirm-dialog.component";
import { Notifications } from "../../util/notification";
import { AddEditNewsDialogComponent } from "./dialog/add-edit-news-dialog/add-edit-news-dialog.component";

@Component({
  selector: "app-list-news",
  templateUrl: "./list-news.component.html",
  styleUrls: ["./list-news.component.css"],
})
export class ListNewsComponent implements OnInit, OnDestroy {
  newsList: News[] = [];
  displayedColumns: string[] = ["topic", "detail", "start_time", "end_time"];

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
    private teacherService: TeacherService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);

    let login: Login = JSON.parse(localStorage.getItem("userData")) as Login;
    this.listNewsObs = this.teacherService
      .getTeacherByUsername(login.username)
      .subscribe((teacher) => {
        this.teacher = teacher;
        this.newsService
          .getNewsByTeacherReference(teacher.ref)
          .subscribe((news) => {
            this.newsList = news;
            news.forEach((item) => {
              if (
                item.image === "" ||
                item.image === null ||
                item.image === undefined
              ) {
                this.imagePath.set(
                  item.id,
                  "assets/img/no-photo-available.png"
                );
              } else {
                this.afStorage.storage
                  .ref(item.image)
                  .getDownloadURL()
                  .then((url) => {
                    this.imagePath.set(item.id, url);
                  });
              }
              return item;
            });

            if (this.newsList.length === 0) {
              this.showContent = false;
            } else {
              this.spinner.hide();
              this.showContent = true;
            }
          });
      });
  }

  ngOnDestroy() {
    this.listNewsObs.unsubscribe();
  }

  openAddEditNewsDialog(news: News): void {
    const dialogRef = this.dialog.open(AddEditNewsDialogComponent, {
      width: "90%",
      height: "90%",
      data: { news: news, school: this.teacher.ref.parent.parent.id },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;
      try {
        if (result.mode === "เพิ่ม") {
          this.newsService.addNews(this.teacher.ref, result.news);
          new Notifications().showNotification(
            "done",
            "top",
            "right",
            "เพิ่มข้อมูลข่าวสารสำเร็จแล้ว",
            "success",
            "สำเร็จ !"
          );
        } else if (result.mode === "แก้ไข") {
          this.newsService.editNews(news.ref, result.news);
          new Notifications().showNotification(
            "done",
            "top",
            "right",
            "แก้ไขข้อมูลข่าวสารสำเร็จแล้ว",
            "success",
            "สำเร็จ !"
          );
        }
      } catch (error) {
        new Notifications().showNotification(
          "close",
          "top",
          "right",
          error.message,
          "danger",
          "จัดการข้อมูลล้มเหลว !"
        );
      }
    });
  }

  openDeleteNewsDialog(news: News) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "auto",
      data: `คุณต้องการลบข่าว ${news.topic} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          this.newsService.deleteNews(news);
          new Notifications().showNotification(
            "done",
            "top",
            "right",
            "ลบข้อมูลข่าวสำเร็จแล้ว",
            "success",
            "สำเร็จ !"
          );
        }
      } catch (error) {
        new Notifications().showNotification(
          "close",
          "top",
          "right",
          error.message,
          "danger",
          "ลบข้อมูลล้มเหลว !"
        );
      }
    });
  }

  onNewsClick(news_id: string) {
    this.router.navigate([
      "/teacher/list-news/view-news",
      { news_id: news_id },
    ]);
  }
}
