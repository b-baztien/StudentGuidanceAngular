import { MatDialogRef } from "@angular/material";
import { TcasScore } from "./../../../../../../../../../model/util/TcasScore";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Tcas } from "src/app/model/Tcas";
import { isNullOrUndefined } from "util";
import { TcasService } from "src/app/services/tcas-service/tcas.service";
import { Major } from "src/app/model/Major";

@Component({
  selector: "app-edit-tcas-major-content",
  templateUrl: "./edit-tcas-major-content.component.html",
  styleUrls: ["./edit-tcas-major-content.component.css"],
})
export class EditTcasMajorContentComponent implements OnInit {
  @Input() tcas: Tcas;
  @Input() round: number;
  @Output() submitBtn = new EventEmitter();

  tcasForm = new FormGroup({
    date: new FormControl(
      isNullOrUndefined(this.tcas)
        ? null
        : { begin: this.tcas.startDate, end: this.tcas.endDate }
    ),
    entranceAmount: new FormControl(
      isNullOrUndefined(this.tcas) ? null : this.tcas.entranceAmount
    ),
    examFee: new FormControl(
      isNullOrUndefined(this.tcas) ? null : this.tcas.examFee
    ),
    registerPropertie: new FormControl(
      isNullOrUndefined(this.tcas) ? null : this.tcas.registerPropertie
    ),
    remark: new FormControl(
      isNullOrUndefined(this.tcas) ? null : this.tcas.remark
    ),
  });

  constructor() {}

  ngOnInit() {
    if (isNullOrUndefined(this.tcas)) {
      this.tcas = new Tcas();
    }
  }

  onAddTcasScore() {
    let score: TcasScore = { scoreName: "", scorePercent: 0 };
    this.tcas.score.push(score);
  }

  onDeleteTcasScore(index: number) {
    this.tcas.score.splice(index, 1);
  }

  async onSubmit() {
    if (this.tcasForm.valid) {
      this.tcas.startDate = this.tcasForm.get("date").value.begin;
      this.tcas.endDate = this.tcasForm.get("date").value.end;
      this.tcas.entranceAmount = this.tcasForm.get("entranceAmount").value;
      this.tcas.examFee = this.tcasForm.get("examFee").value;
      this.tcas.registerPropertie = this.tcasForm.get(
        "registerPropertie"
      ).value;
      this.tcas.remark = this.tcasForm.get("remark").value;
      this.tcas.round = this.round.toString();

      this.submitBtn.emit(this.tcas);
    }
  }

  onNoClick(): void {}
}
