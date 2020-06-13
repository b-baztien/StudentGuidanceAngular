import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Subscription } from "rxjs";
import { Tcas } from "src/app/model/Tcas";
import { TcasService } from "src/app/services/tcas-service/tcas.service";
import { isNullOrUndefined } from "util";
import { Major } from "./../../../../../../../../model/Major";

@Component({
  selector: "app-edit-tcas-major",
  templateUrl: "./edit-tcas-major.component.html",
  styleUrls: ["./edit-tcas-major.component.css"],
})
export class EditTcasMajorComponent implements OnInit {
  loadData = false;

  listTcas: Tcas[] = new Array<Tcas>();
  tcasSub: Subscription;

  tcasTabLabel: number[] = [1, 2, 3, 4, 5];

  constructor(
    public dialogRef: MatDialogRef<EditTcasMajorComponent>,
    private tcasService: TcasService,
    @Inject(MAT_DIALOG_DATA) public data: Major
  ) {}

  ngOnInit() {
    this.tcasSub = this.tcasService
      .getTcasByMajorReference(this.data.ref)
      .subscribe((tcasDocs) => {
        const listTcasData = tcasDocs.map((docs) => {
          return { id: docs.id, ref: docs.ref, ...(docs.data() as Tcas) };
        });
        for (let index = 1; index <= 5; index++) {
          let tcasData: Tcas;
          tcasData = listTcasData.find((tcas) => tcas.round == "" + index);
          tcasData = tcasData ? tcasData : null;
          this.listTcas.push(tcasData);
        }
        this.loadData = true;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit(result: { tcas: Tcas; mode: string }) {
    this.dialogRef.close({ tcas: result.tcas, mode: result.mode });
  }
}
