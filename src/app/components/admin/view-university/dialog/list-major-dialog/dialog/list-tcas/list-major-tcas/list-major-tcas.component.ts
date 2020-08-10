import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import { Subscription } from "rxjs";
import { Tcas } from "src/app/model/Tcas";
import { TcasService } from "src/app/services/tcas-service/tcas.service";
import { ViewMajorTcasComponent } from "./dialog/view-tcas/view-major-tcas/view-major-tcas.component";
import { DocumentReference } from "@angular/fire/firestore";

@Component({
  selector: "app-list-major-tcas",
  templateUrl: "./list-major-tcas.component.html",
  styleUrls: ["./list-major-tcas.component.css"],
})
export class ListMajorTcasComponent implements OnInit, OnDestroy {
  @Input() majorRef: DocumentReference;

  tcasSub: Subscription;
  listButtonTcas = new Array<{
    label: string;
    color: string;
    tcas: Tcas;
  }>();

  constructor(
    private tcasService: TcasService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ListMajorTcasComponent>
  ) {}

  ngOnInit() {
    this.tcasSub = this.tcasService
      .getTcasByMajorReferenceRealtime(this.majorRef)
      .subscribe((tcasDocs) => {
        this.listButtonTcas = [];

        tcasDocs.forEach((docs) => {
          let tcasData: Tcas = {
            id: docs.id,
            ref: docs.ref,
            ...(docs.data() as Tcas),
          };
          this.listButtonTcas.push({
            label: tcasData.round,
            color: "primary",
            tcas: tcasData,
          });
        });
      });
  }

  ngOnDestroy(): void {
    this.tcasSub.unsubscribe();
  }

  openTcasDialog(tcas: Tcas): void {
    const dialogRef = this.dialog.open(ViewMajorTcasComponent, {
      width: "90%",
      height: "auto",
      data: tcas ? tcas : null,
    });
    dialogRef.afterClosed().subscribe(async (newMajor) => {});
  }
}
