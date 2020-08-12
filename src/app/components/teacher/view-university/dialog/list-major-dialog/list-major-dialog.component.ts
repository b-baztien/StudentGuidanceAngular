import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { DocumentReference } from "@angular/fire/firestore";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from "rxjs";
import { ConfirmDialogComponent } from "src/app/components/util/confirm-dialog/confirm-dialog.component";
import { Notifications } from "src/app/components/util/notification";
import { Major } from "src/app/model/Major";
import { MajorService } from "src/app/services/major-service/major.service";
import { Tcas } from "./../../../../../model/Tcas";
import { TcasService } from "./../../../../../services/tcas-service/tcas.service";

@Component({
  selector: "app-list-major-dialog",
  templateUrl: "./list-major-dialog.component.html",
  styleUrls: ["./list-major-dialog.component.css"],
})
export class ListMajorTeacherDialogComponent implements OnInit, OnDestroy {
  listMajor = new Array<Major>();
  haveCareer = false;
  showData = false;

  majorSub: Subscription;

  constructor(
    private majorService: MajorService,
    private tcasService: TcasService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ListMajorTeacherDialogComponent>,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DocumentReference
  ) {}

  async ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);

    this.majorSub = this.majorService
      .getMajorByFacultyReference(this.data)
      .subscribe((majorDocs) => {
        this.listMajor = majorDocs.map((docs) => {
          return { id: docs.id, ref: docs.ref, ...(docs.data() as Major) };
        });

        if (this.listMajor === undefined || this.listMajor.length === 0) {
          this.showData = false;
          this.dialogRef.updateSize("90%", "auto");
        } else {
          this.spinner.hide();
          this.showData = true;
          this.dialogRef.updateSize("90%", "90%");
        }
      });
  }

  ngOnDestroy(): void {
    this.majorSub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
