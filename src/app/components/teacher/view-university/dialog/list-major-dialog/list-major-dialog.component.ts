import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MajorService } from "src/app/services/major-service/major.service";
import { Major } from "src/app/model/Major";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DocumentReference } from "@angular/fire/firestore";

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
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ListMajorTeacherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentReference,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
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
