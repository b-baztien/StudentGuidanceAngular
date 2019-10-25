import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Major } from 'src/app/model/Major';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { AddMajorDialogComponent } from '../../../add-major-dialog/add-major-dialog.component';
import { MajorService } from 'src/app/services/major-service/major.service';
import { CarrerService } from 'src/app/services/carrer-service/carrer.service';
import { Carrer } from 'src/app/model/Carrer';
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
    carrer: new FormControl(null),
  });

  majorDoc: DocumentSnapshot<unknown>;
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
    @Inject(MAT_DIALOG_DATA) public data: Observable<Action<DocumentSnapshot<unknown>>>,
  ) {

  }

  async ngOnInit() {
    await this.data.subscribe(async result => {
      this.majorDoc = result.payload;

      let major = this.majorDoc.data() as Major;
      this.majorForm.get('major_name').setValue(major.major_name);
      this.majorForm.get('entrance_detail').setValue(major.entrance_detail);
      this.majorForm.get('url').setValue(major.url);

      major.carrer.forEach(result => {
        this.listCarrer_name.push(result.id);
      });
    });
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
    try {
      await this.carrerService.deleteMajorInCarrer(this.majorDoc.ref).then(async () => {
        let major = this.majorDoc.data() as Major;
        if (this.majorForm.valid && this.listCarrer_name.length !== 0) {
          major.major_name = this.majorForm.get('major_name').value;
          major.url = this.majorForm.get('url').value;
          major.entrance_detail = this.majorForm.get('entrance_detail').value;

          let listCarrerRef = new Array<DocumentReference>();
          const setCarrer = new Set(this.listCarrer_name);
          await setCarrer.forEach(async carrerName => {
            const carrer = new Carrer();
            carrer.carrer_name = carrerName;
            carrer.major = carrer.major === undefined ? new Array<DocumentReference>() : carrer.major;
            carrer.major.push(this.majorDoc.ref);
            await this.carrerService.addCarrer(carrer).then(async carrerDocRef => {
              await listCarrerRef.push(carrerDocRef);
              major.carrer = new Array<DocumentReference>();
              major.carrer = await listCarrerRef;
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
    return this.allCarrer.filter(carrer => carrer.toLowerCase().includes(filterValue));
  }
}
