import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { Major } from 'src/app/model/Major';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MajorService } from 'src/app/services/major-service/major.service';
import { CarrerService } from 'src/app/services/carrer-service/carrer.service';
import { ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DocumentReference } from '@angular/fire/firestore';
import { Carrer } from 'src/app/model/Carrer';

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
    carrer: new FormControl(null),
  });

  major: Major;
  listCarrer_name: string[] = new Array<string>();
  allCarrer: string[] = new Array<string>();
  filteredCarrer: Observable<string[]>;

  loadData = false;

  selectable = true;
  addOnBlur = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER];

  @ViewChild('carrerInput', { static: false }) carrerInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AddMajorDialogComponent>,
    private majorService: MajorService,
    private carrerService: CarrerService,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {

  }

  ngOnInit() {
    this.dialogRef.disableClose = true;
  }

  async ngAfterViewInit() {
    await this.carrerService.getAllCarrer().subscribe(listCarrerRes => {
      listCarrerRes.forEach(carrerRes => {
        const carrer = carrerRes.payload.doc.data() as Carrer;
        this.allCarrer.push(carrer.carrer_name);
      }),
        this.loadData = true;
    }),
      this.filteredCarrer = this.majorForm.get('carrer').valueChanges.pipe(
        startWith(null),
        map((carrer: string | null) => carrer ? this._filter(carrer) : this.allCarrer.slice()));
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }


  addCarrer(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.listCarrer_name.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.majorForm.get('carrer').setValue(null);
    }
  }

  removeCarrer(carrer: string): void {
    const index = this.listCarrer_name.indexOf(carrer);

    if (index >= 0) {
      this.listCarrer_name.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.listCarrer_name.push(event.option.viewValue);
    this.carrerInput.nativeElement.value = '';
    this.majorForm.get('carrer').setValue(null);
  }

  async onSubmit() {
    this.major = new Major;
    if (this.majorForm.valid && this.listCarrer_name.length !== 0) {
      try {
        this.major.major_name = this.majorForm.get('major_name').value;
        this.major.url = this.majorForm.get('url').value;
        this.major.entrance_detail = this.majorForm.get('entrance_detail').value;

        await this.majorService.addMajor(this.data, this.major).then(async majorRef => {
          console.log(majorRef);
          majorRef.get().then(dd => {
            console.log(dd.data());
          })
          let listCarrerRef = new Array<DocumentReference>();
          const setCarrer = new Set(this.listCarrer_name);
          await setCarrer.forEach(async carrerName => {
            const carrer = new Carrer();
            carrer.carrer_name = carrerName;
            carrer.major = carrer.major === undefined ? new Array<DocumentReference>() : carrer.major;
            carrer.major.push(majorRef);
            await this.carrerService.addCarrer(carrer).then(async carrerDocRef => {
              await listCarrerRef.push(carrerDocRef);
              this.majorService.getMajor(majorRef.id).subscribe(async majorData => {
                let major: Major = majorData.payload.data() as Major;
                major.carrer = await listCarrerRef;
                this.majorService.updateMajor(majorData.payload.id, major);
              });
            });
          });
        });
      }
      catch (error) {
        console.log(error);
      }
      this.dialogRef.close();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCarrer.filter(carrer => carrer.toLowerCase().indexOf(filterValue) === 0);
  }
}