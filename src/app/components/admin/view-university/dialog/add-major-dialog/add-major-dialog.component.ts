import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { Major } from 'src/app/model/Major';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm, FormArray } from '@angular/forms';
import { MajorService } from 'src/app/services/major-service/major.service';
import { CareerService } from 'src/app/services/career-service/career.service';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DocumentReference } from '@angular/fire/firestore';
import { Career } from 'src/app/model/Career';
import { Tcas } from 'src/app/model/Tcas';
import { Notifications } from 'src/app/components/util/notification';
import { TcasRound } from 'src/app/model/util/TcasRound';

@Component({
  selector: 'app-add-major-dialog',
  templateUrl: './add-major-dialog.component.html',
  styleUrls: ['./add-major-dialog.component.css']
})
export class AddMajorDialogComponent implements OnInit, AfterViewInit {
  tcasRound: Tcas[] = TcasRound.allTcasRound;

  majorForm = new FormGroup({
    majorName: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
    tcasEntranceRound: new FormControl([], [Validators.required]),
    certificate: new FormControl(null, [Validators.required]),
    tuitionFee: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    courseDuration: new FormControl(null, Validators.compose(
      [
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])
    ),
    career: new FormControl(null),
  });

  selectedCareer = new Array<string>();
  listAllCareer: string[] = new Array<string>();
  filteredCareer: Observable<string[]>;

  loadData = false;

  selectable = true;
  addOnBlur = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, SPACE];

  @ViewChild('careerInput', { static: false }) careerInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AddMajorDialogComponent>,
    private majorService: MajorService,
    private careerService: CareerService,
    @Inject(MAT_DIALOG_DATA) public data: DocumentReference,
  ) {
  }

  ngOnInit() {
    this.careerService.getAllCareer().subscribe(careerDocs => {
      this.listAllCareer = careerDocs.map(doc => (doc.data() as Career).career_name);
      this.loadData = true;
    });
  }

  ngAfterViewInit() {
    this.filteredCareer = this.majorForm.get('career').valueChanges.pipe(
      startWith(null),
      map((career: string | null) => career ? this._filter(career) : this.listAllCareer.slice()));
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }


  addCareer(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim() && !this.selectedCareer.includes(value)) {
        this.selectedCareer.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.majorForm.get('career').setValue(null);
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
    this.careerInput.nativeElement.value = '';
    this.majorForm.get('career').setValue(null);
  }

  async onSubmit() {
    let major = new Major;
    if (this.majorForm.invalid || this.selectedCareer.length === 0) return;
    try {
      major.majorName = this.majorForm.get('majorName').value;
      major.url = this.majorForm.get('url').value;
      major.certificate = this.majorForm.get('certificate').value;
      major.courseDuration = this.majorForm.get('courseDuration').value;
      major.tcasEntranceRound = this.majorForm.get('tcasEntranceRound').value;
      major.tuitionFee = this.majorForm.get('tuitionFee').value;
      major.listCareerName = this.selectedCareer;

      await this.careerService.addAllCareer(
        this.selectedCareer.map(career_name => {
          let career = new Career();
          career.career_name = career_name;
          return career;
        })
      );
      await this.majorService.addMajor(this.data, major);
      new Notifications().showNotification('done', 'top', 'right', 'เพิ่มข้อมูลสาขาสำเร็จแล้ว', 'success', 'สำเร็จ !');
    }
    catch (error) {
      new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'เพิ่มข้อมูลล้มเหลว !');
    }
    this.dialogRef.close();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listAllCareer.filter(career => career.toLowerCase().includes(filterValue));
  }

}