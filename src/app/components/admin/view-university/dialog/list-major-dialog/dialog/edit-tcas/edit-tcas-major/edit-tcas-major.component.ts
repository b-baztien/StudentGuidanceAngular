import { Subscription } from "rxjs";
import { isNullOrUndefined } from "util";
import { Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Major } from "./../../../../../../../../model/Major";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";
import { TcasService } from "src/app/services/tcas-service/tcas.service";
import { Tcas } from "src/app/model/Tcas";

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
    this.dialogRef.close(null);
  }

  async onSubmit(tcas: Tcas) {
    if (isNullOrUndefined(tcas)) {
      this.dialogRef.close({ tcas: tcas, mode: "add" });
    } else {
      this.dialogRef.close({ tcas: tcas, mode: "update" });
    }
  }
}
