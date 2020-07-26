import { Component, OnInit, Input } from "@angular/core";
import { Tcas } from "src/app/model/Tcas";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { isNullOrUndefined } from "util";
import { RegularExpressionUtil } from "src/app/model/util/RegularExpressionUtil";

@Component({
  selector: "app-edit-tcas-university-dialog",
  templateUrl: "./edit-tcas-university-dialog.component.html",
  styleUrls: ["./edit-tcas-university-dialog.component.css"],
})
export class EditTcasUniversityDialogComponent implements OnInit {
  tcas: Tcas;
  round: number;

  tcasForm: FormGroup;

  mode: string = "edit";

  constructor() {}

  ngOnInit() {
    this.tcasForm = new FormGroup({
      date: new FormControl(
        isNullOrUndefined(this.tcas)
          ? null
          : {
              begin: this.tcas.startDate.toDate(),
              end: this.tcas.endDate.toDate(),
            },
        [Validators.required]
      ),
      entranceAmount: new FormControl(
        isNullOrUndefined(this.tcas) ? null : this.tcas.entranceAmount,
        [Validators.required]
      ),
      url: new FormControl(
        isNullOrUndefined(this.tcas) ? null : this.tcas.url,
        [Validators.required, Validators.pattern(RegularExpressionUtil.urlReg)]
      ),
    });
    if (isNullOrUndefined(this.tcas)) {
      this.mode = "add";
      this.tcas = new Tcas();
    }
  }

  async onSubmit() {
    if (this.tcasForm.valid) {
      this.tcas.round = this.round.toString();
      this.tcas.startDate = new Date(
        this.tcasForm.get("date").value.begin
      ) as any;
      this.tcas.endDate = new Date(this.tcasForm.get("date").value.end) as any;
      this.tcas.entranceAmount = this.tcasForm.get("entranceAmount").value;
      this.tcas.url = this.tcasForm.get("url").value;
    }
  }

  onNoClick(): void {}
}
