import { isNullOrUndefined } from "util";
import { AfterContentChecked, Component, Inject, OnInit } from "@angular/core";
import { DocumentReference } from "@angular/fire/firestore";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Subscription } from "rxjs";
import { Major } from "src/app/model/Major";
import { Tcas } from "src/app/model/Tcas";
import { TcasService } from "src/app/services/tcas-service/tcas.service";

@Component({
  selector: "app-edit-tcas-major",
  templateUrl: "./edit-tcas-major.component.html",
  styleUrls: ["./edit-tcas-major.component.css"],
})
export class EditTcasMajorComponent implements OnInit, AfterContentChecked {
  loadData = false;

  listTcasUniversity: Tcas[] = new Array<Tcas>();
  listTcas: Tcas[] = new Array<Tcas>();
  tcasSub: Subscription;

  tcasTabLabel: number[] = [];

  tcasRoundForm: FormGroup;
  selected = new FormControl(0);

  constructor(
    public dialogRef: MatDialogRef<EditTcasMajorComponent>,
    private tcasService: TcasService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { major: Major; universityRef: DocumentReference }
  ) {
    this.tcasRoundForm = this.formBuilder.group({
      round: new FormControl(null),
    });
  }

  async ngOnInit() {
    this.listTcasUniversity = await this.tcasService.getAllTcasUniversity(
      this.data.universityRef
    );

    let tcasMajorDocs = await this.tcasService
      .getTcasByMajorReference(this.data.major.ref)
      .toPromise();

    this.listTcas = tcasMajorDocs.map((docs) => {
      return { id: docs.id, ref: docs.ref, ...(docs.data() as Tcas) };
    });

    this.tcasTabLabel = this.listTcas.map((tcas) => +tcas.round);

    //
    this.listTcasUniversity.forEach((tcas) => {
      let isfound = false;
      this.tcasTabLabel.forEach((round) => {
        if (tcas.round == round.toString()) {
          isfound = true;
        }
      });

      this.listTcasUniversity.forEach((tcasUni) => {
        if (!this.tcasTabLabel.find((round) => round == +tcasUni.round)) {
          let tcasData: Tcas = this.listTcasUniversity.find(
            (tcas) => tcas.round == tcasUni.round
          );
          tcasData.entranceAmount = null;
          tcasData.url = null;
          tcasData.year = null;
          this.listTcas.push(tcasData);
          this.tcasTabLabel.push(+tcasData.round);
        }
      });
    });
    this.listTcas = this.listTcas.sort((a, b) => +a.round - +b.round);
    //sort tcas by round
    this.tcasTabLabel = this.tcasTabLabel.sort((a, b) => a - b);
  }

  ngAfterContentChecked(): void {
    this.loadData = this.tcasTabLabel.length === 0 ? false : true;
  }

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }

  private matchTcasRound(group: FormGroup) {
    let round = group.get("round").value;

    if (this.tcasTabLabel.includes(round)) {
      group.get("round").setErrors({ alreadyRound: true });
    } else {
      return null;
    }
  }

  onAddRoundClick(): void {
    this.matchTcasRound(this.tcasRoundForm);
    if (this.tcasRoundForm.valid) {
      let round = this.tcasRoundForm.get("round").value;
      this.tcasTabLabel.push(round);
      this.tcasRoundForm.get("round").setValue(null);
      this.selected.setValue(this.tcasTabLabel.length - 1);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit(result: { tcas: Tcas; mode: string }) {
    this.dialogRef.close({ tcas: result.tcas, mode: result.mode });
  }
}
