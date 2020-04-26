import { ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { DocumentSnapshot } from "@angular/fire/firestore";
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Career } from "src/app/model/Career";
import { Major } from "src/app/model/Major";
import { CareerService } from "src/app/services/career-service/career.service";

@Component({
  selector: "app-edit-major",
  templateUrl: "./edit-major.component.html",
  styleUrls: ["./edit-major.component.css"],
})
export class EditMajorComponent implements OnInit {
  majorForm = new FormGroup({
    majorName: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
    certificate: new FormControl(null, [Validators.required]),
    courseDuration: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])
    ),
    career: new FormControl(null),
  });

  majorDoc: DocumentSnapshot<unknown>;
  selectedCareer: string[] = new Array<string>();
  listAllCareerName: string[] = new Array<string>();
  filteredCareer: Observable<string[]>;

  loadData = false;

  selectable = true;
  addOnBlur = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER];

  @ViewChild("careerInput", { static: false }) careerInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<EditMajorComponent>,
    private careerService: CareerService,
    @Inject(MAT_DIALOG_DATA) public data: Major
  ) {}

  ngOnInit() {
    this.majorForm.get("majorName").setValue(this.data.majorName);
    this.majorForm.get("url").setValue(this.data.url);
    this.majorForm.get("certificate").setValue(this.data.certificate);
    this.majorForm.get("courseDuration").setValue(this.data.courseDuration);
    this.majorForm.get("career").setValue(this.data.listCareerName);
    this.selectedCareer = this.data.listCareerName;

    this.careerService.getAllCareer().subscribe((listCareerRes) => {
      listCareerRes.forEach((careerRes) => {
        const career = careerRes.data() as Career;
        this.listAllCareerName.push(career.career_name);
      });
      this.loadData = true;
    });
    this.filteredCareer = this.majorForm.get("career").valueChanges.pipe(
      startWith(null),
      map((career: string | null) =>
        career ? this._filter(career) : this.listAllCareerName.slice()
      )
    );
  }

  ngAfterViewInit() {}

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

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  addCareer(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || "").trim()) {
        this.selectedCareer.push(value.trim());
      }

      if (input) {
        input.value = "";
      }

      this.majorForm.get("career").setValue(null);
    }
  }

  removeCareer(career: string): void {
    const index = this.selectedCareer.indexOf(career);

    if (index >= 0) {
      this.selectedCareer.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedCareer.includes(event.option.viewValue)) {
      this.selectedCareer.push(event.option.viewValue);
    }
    this.careerInput.nativeElement.value = "";
    this.majorForm.get("career").setValue(null);
  }

  async onSubmit() {
    let major = new Major();
    if (this.majorForm.invalid && this.selectedCareer.length === 0) return;
    major.majorName = this.majorForm.get("majorName").value;
    major.url = this.majorForm.get("url").value;
    major.certificate = this.majorForm.get("certificate").value;
    major.courseDuration = this.majorForm.get("courseDuration").value;
    major.listCareerName = this.selectedCareer;

    this.dialogRef.close(major);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listAllCareerName.filter((career) =>
      career.toLowerCase().includes(filterValue)
    );
  }
}
