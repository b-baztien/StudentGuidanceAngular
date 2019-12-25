import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Major } from 'src/app/model/Major';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { AddMajorDialogComponent } from '../../../add-major-dialog/add-major-dialog.component';
import { MajorService } from 'src/app/services/major-service/major.service';
import { CareerService } from 'src/app/services/career-service/career.service';
import { Career } from 'src/app/model/Career';
import { startWith, map } from 'rxjs/operators';
import { ENTER } from '@angular/cdk/keycodes';
import { DocumentReference, DocumentSnapshot, Action, QuerySnapshot } from '@angular/fire/firestore';
import { Notifications } from 'src/app/components/util/notification';

@Component({
  selector: 'app-edit-major',
  templateUrl: './edit-major.component.html',
  styleUrls: ['./edit-major.component.css']
})
export class EditMajorComponent implements OnInit {
  majorForm = new FormGroup({
    major_name: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
    entrance_detail: new FormControl(null, [Validators.required]),
    career: new FormControl(null),
  });

  majorDoc: DocumentSnapshot<unknown>;
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
    @Inject(MAT_DIALOG_DATA) public data: Observable<Action<DocumentSnapshot<unknown>>>,
  ) { }

  ngOnInit() {
    this.data.subscribe(async result => {
      this.majorDoc = result.payload;

      let major = this.majorDoc.data() as Major;
      this.majorForm.get('major_name').setValue(major.major_name);
      this.majorForm.get('entrance_detail').setValue(major.entrance_detail);
      this.majorForm.get('url').setValue(major.url);

      major.career.forEach(result => {
        this.listCareer_name.push(result.id);
      });
    });
  }

  ngAfterViewInit() {
    this.careerService.getAllCareer().subscribe(listCareerRes => {
      listCareerRes.forEach(careerRes => {
        const career = careerRes.payload.doc.data() as Career;
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
    try {
      await this.careerService.deleteMajorInCareer(this.majorDoc.ref).then(async () => {
        let major = this.majorDoc.data() as Major;
        if (this.majorForm.valid && this.listCareer_name.length !== 0) {
          major.major_name = this.majorForm.get('major_name').value;
          major.url = this.majorForm.get('url').value;
          major.entrance_detail = this.majorForm.get('entrance_detail').value;

          let listCareerRef = new Array<DocumentReference>();
          const setCareer = new Set(this.listCareer_name);
          setCareer.forEach(async careerName => {
            const career = new Career();
            career.career_name = careerName;
            career.major = career.major === undefined ? new Array<DocumentReference>() : career.major;
            career.major.push(this.majorDoc.ref);
            await this.careerService.addCareer(career).then(async careerDocRef => {
              listCareerRef.push(careerDocRef);
              major.career = new Array<DocumentReference>();
              major.career = listCareerRef;
              this.majorService.updateMajor(this.majorDoc.id, major);
            });
          });
        }
        new Notifications().showNotification('done', 'top', 'right', 'แก้ไขข้อมูลสาขาสำเร็จแล้ว', 'success', 'สำเร็จ !');
        this.dialogRef.close();
      });
    } catch (error) {
      new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'เพิ่มข้อมูลล้มเหลว !');
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCareer.filter(career => career.toLowerCase().includes(filterValue));
  }
}
