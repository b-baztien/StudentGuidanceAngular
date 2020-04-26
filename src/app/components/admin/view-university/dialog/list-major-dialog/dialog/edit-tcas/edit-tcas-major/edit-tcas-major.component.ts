import { Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Major } from "./../../../../../../../../model/Major";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";

@Component({
  selector: "app-edit-tcas-major",
  templateUrl: "./edit-tcas-major.component.html",
  styleUrls: ["./edit-tcas-major.component.css"],
})
export class EditTcasMajorComponent implements OnInit {
  loadData = false;

  tcasTabLabel: number[] = [1, 2, 3, 4, 5];

  majorForm = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    majorName: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
    certificate: new FormControl(null, [Validators.required]),
    courseDuration: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])
    ),
    career: new FormControl(null),
  });

  constructor(
    public dialogRef: MatDialogRef<EditTcasMajorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Major
  ) {}

  ngOnInit() {
    this.majorForm.get("majorName").setValue(this.data.majorName);
    this.majorForm.get("url").setValue(this.data.url);
    this.majorForm.get("certificate").setValue(this.data.certificate);
    this.majorForm.get("courseDuration").setValue(this.data.courseDuration);
    this.loadData = true;
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  async onSubmit(round: number) {
    let major = new Major();
    major.majorName = this.majorForm.get("majorName").value;
    major.url = this.majorForm.get("url").value;
    major.certificate = this.majorForm.get("certificate").value;
    major.courseDuration = this.majorForm.get("courseDuration").value;

    console.log(this.majorForm.controls, round);

    // this.dialogRef.close(major);
  }
}
