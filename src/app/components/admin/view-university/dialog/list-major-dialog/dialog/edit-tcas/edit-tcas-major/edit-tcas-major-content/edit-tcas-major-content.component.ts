import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Tcas } from "src/app/model/Tcas";
import { isNullOrUndefined } from "util";
import { RegularExpressionUtil } from "src/app/model/util/RegularExpressionUtil";

@Component({
  selector: "app-edit-tcas-major-content",
  templateUrl: "./edit-tcas-major-content.component.html",
  styleUrls: ["./edit-tcas-major-content.component.css"],
})
export class EditTcasMajorContentComponent implements OnInit {
  @Input() tcas: Tcas;
  @Input() round: number;
  @Output() submitBtn = new EventEmitter();
  @Output() cancelBtn = new EventEmitter();

  tcasForm: FormGroup;

  mode: string = "edit";

  constructor() {}

  ngOnInit() {
    this.tcasForm = new FormGroup({
      date: new FormControl(
        isNullOrUndefined(this.tcas) || isNullOrUndefined(this.tcas.startDate)
          ? null
          : {
              begin: this.tcas.startDate.toDate(),
              end: this.tcas.endDate.toDate(),
            },
        [Validators.required]
      ),
      entranceAmount: new FormControl(
        isNullOrUndefined(this.tcas) ||
        isNullOrUndefined(this.tcas.entranceAmount)
          ? null
          : this.tcas.entranceAmount,
        [Validators.required]
      ),
      url: new FormControl(
        isNullOrUndefined(this.tcas) || isNullOrUndefined(this.tcas.url)
          ? null
          : this.tcas.url,
        [Validators.required, Validators.pattern(RegularExpressionUtil.urlReg)]
      ),
    });

    if (!this.tcas || !this.tcas.entranceAmount) {
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

      this.submitBtn.emit({ tcas: this.tcas, mode: this.mode });
    }
  }

  onNoClick(): void {
    this.cancelBtn.emit();
  }
}
