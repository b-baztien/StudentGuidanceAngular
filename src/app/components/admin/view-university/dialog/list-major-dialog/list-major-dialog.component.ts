import { EditTcasMajorComponent } from "./dialog/edit-tcas/edit-tcas-major/edit-tcas-major.component";
import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MajorService } from "src/app/services/major-service/major.service";
import { Major } from "src/app/model/Major";
import { EditMajorComponent } from "./dialog/edit-major/edit-major.component";
import { Notifications } from "src/app/components/util/notification";
import { ConfirmDialogComponent } from "src/app/components/util/confirm-dialog/confirm-dialog.component";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DocumentReference } from "@angular/fire/firestore";

@Component({
  selector: "app-list-major-dialog",
  templateUrl: "./list-major-dialog.component.html",
  styleUrls: ["./list-major-dialog.component.css"],
})
export class ListMajorAdminDialogComponent implements OnInit, OnDestroy {
  listMajor = new Array<Major>();
  haveCareer = false;
  showData = false;

  majorSub: Subscription;

  constructor(
    private majorService: MajorService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ListMajorAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentReference
  ) {}

  ngOnInit() {
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
          
          this.showData = true;
          this.dialogRef.updateSize("90%", "90%");
        }
      });
  }

  ngOnDestroy(): void {
    this.majorSub.unsubscribe();
  }

  openEditMajorDialog(major: Major): void {
    const dialogRef = this.dialog.open(EditMajorComponent, {
      width: "90%",
      maxHeight: "90%",
      data: major,
    });
    dialogRef.afterClosed().subscribe(async (newMajor) => {
      try {
        if (!newMajor) return;
        await this.majorService.updateMajor(major.ref, newMajor);
        new Notifications().showNotification(
          "done",
          "top",
          "right",
          "แก้ไขข้อมูลสาขาสำเร็จแล้ว",
          "success",
          "สำเร็จ !"
        );
      } catch (error) {
        new Notifications().showNotification(
          "close",
          "top",
          "right",
          error.message,
          "danger",
          "แก้ไขข้อมูลล้มเหลว !"
        );
      }
    });
  }

  openEditTcasDialog(major: Major): void {
    const dialogRef = this.dialog.open(EditTcasMajorComponent, {
      width: "90%",
      height: "auto",
      data: major,
    });
    dialogRef.afterClosed().subscribe(async (newMajor) => {
      // try {
      //   if (!newMajor) return;
      //   await this.majorService.updateMajor(major.ref, newMajor);
      //   new Notifications().showNotification('done', 'top', 'right', 'แก้ไขข้อมูลสาขาสำเร็จแล้ว', 'success', 'สำเร็จ !');
      // } catch (error) {
      //   new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'แก้ไขข้อมูลล้มเหลว !');
      // }
    });
  }

  onDelete(major: Major) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "auto",
      data: `คุณต้องการลบข้อมูลสาขา${major.majorName} ใช่ หรือ ไม่ ?`,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          await this.majorService.deleteMajor(major.ref);
          new Notifications().showNotification(
            "done",
            "top",
            "right",
            "ลบข้อมูลสาขาสำเร็จแล้ว",
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
