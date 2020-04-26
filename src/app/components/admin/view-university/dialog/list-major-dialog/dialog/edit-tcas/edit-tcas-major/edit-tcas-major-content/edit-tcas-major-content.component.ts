import { FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-edit-tcas-major-content",
  templateUrl: "./edit-tcas-major-content.component.html",
  styleUrls: ["./edit-tcas-major-content.component.css"],
})
export class EditTcasMajorContentComponent implements OnInit {
  @Input() tcas;

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

  constructor() {}

  ngOnInit() {}

  async onSubmit(round: number) {
    console.log(this.majorForm.controls.date.value);

    // this.dialogRef.close(major);
  }
}
