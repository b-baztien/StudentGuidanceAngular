import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { Major } from 'src/app/model/Major';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MajorService } from 'src/app/services/major-service/major.service';
import { CareerService } from 'src/app/services/career-service/career.service';
import { ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DocumentReference } from '@angular/fire/firestore';
import { Career } from 'src/app/model/Career';
import { Notifications } from 'src/app/components/util/notification';

@Component({
  selector: 'app-add-major-dialog',
  templateUrl: './add-major-dialog.component.html',
  styleUrls: ['./add-major-dialog.component.css']
})
export class AddMajorDialogComponent implements OnInit, AfterViewInit {
  majorForm = new FormGroup({
    major_name: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
    entrance_detail: new FormControl(null),
    career: new FormControl(null),
  });

  major: Major;
  listCareer_name: string[] = new Array<string>();
  allCareer: string[] = new Array<string>();
  filteredCareer: Observable<string[]>;

  loadData = false;

  selectable = true;
  addOnBlur = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER];

  @ViewChild('careerInput', { static: false }) careerInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AddMajorDialogComponent>,
    private majorService: MajorService,
    private careerService: CareerService,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {

  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.careerService.getAllCareer().subscribe(listCareerRes => {
      listCareerRes.forEach(careerRes => {
        const career = careerRes.data() as Career;
        this.allCareer.push(career.career_name);
      })
      this.loadData = true;
    })
    this.filteredCareer = this.majorForm.get('career').valueChanges.pipe(
      startWith(null),
      map((career: string | null) => career ? this._filter(career) : this.allCareer.slice()));
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

      if ((value || '').trim()) {
        this.listCareer_name.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.majorForm.get('career').setValue(null);
    }
  }

  removeCareer(career: string): void {
    const index = this.listCareer_name.indexOf(career);

    if (index >= 0) {
      this.listCareer_name.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.listCareer_name.push(event.option.viewValue);
    this.careerInput.nativeElement.value = '';
    this.majorForm.get('career').setValue(null);
  }

  async onSubmit() {
    this.major = new Major;
    if (this.majorForm.valid && this.listCareer_name.length !== 0) {
      try {
        this.major.major_name = this.majorForm.get('major_name').value;
        this.major.url = this.majorForm.get('url').value;
        this.major.entrance_detail = this.majorForm.get('entrance_detail').value;

        await this.majorService.addMajor(this.data, this.major).then(async majorRef => {
          let listCareerRef = new Array<DocumentReference>();
          const setCareer = new Set(this.listCareer_name);
          setCareer.forEach(async careerName => {
            const career = new Career();
            career.career_name = careerName;
            career.major = career.major === undefined ? new Array<DocumentReference>() : career.major;
            // career.major.push(majorRef);
            await this.careerService.addCareer(career).then(async careerDocRef => {
              listCareerRef.push(careerDocRef);
              // this.majorService.getMajorById(majorRef.id).subscribe(async majorData => {
              //   let major: Major = majorData.payload.data() as Major;
              //   major.career = listCareerRef;
              //   this.majorService.updateMajor(majorData.payload.id, major);
              // });
            });
          });
        });
        new Notifications().showNotification('done', 'top', 'right', 'เพิ่มข้อมูลสาขาสำเร็จแล้ว', 'success', 'สำเร็จ !');
      }
      catch (error) {
        new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'เพิ่มข้อมูลล้มเหลว !');
      }
      this.dialogRef.close();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCareer.filter(career => career.toLowerCase().includes(filterValue));
  }
}