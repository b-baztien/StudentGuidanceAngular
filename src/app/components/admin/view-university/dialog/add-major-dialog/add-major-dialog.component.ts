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

@Component({
  selector: 'app-add-major-dialog',
  templateUrl: './add-major-dialog.component.html',
  styleUrls: ['./add-major-dialog.component.css']
})
export class AddMajorDialogComponent implements OnInit, AfterViewInit {
  tcasRound: Tcas[] = [
    {
      round: '1',
      description: 'Portfolio',
      examReference: [
        'แฟ้มสะสมงาน หรือ portfolio',
        'เกรดเฉลี่ยสะสม (4-5 ภาคเรียน)',
        'คุณสมบัติพิเศษ ของแต่คณะ / สาขาวิชาและมหาวิทยาลัย'
      ]
    },
    {
      round: '2',
      description: 'การรับแบบโควตา',
      examReference: [
        'เกรดเฉลี่ยสะสม',
        'GAT/PAT',
        '9 วิชาสามัญ',
        'คุณสมบัติพิเศษ (มีความแตกต่างกันออกไป ขึ้นอยู่กับแต่ละคณะ/สาขาวิชา)',
        'คะแนน O-NET ขั้นต่ำ (สำหรับบางโครงการ)'
      ]
    },
    {
      round: '3',
      description: 'รับตรงร่วมกัน (+กสพท)',
      examReference: [
        'เกรดเฉลี่ยขั้นต่ำ (สำหรับบางโครงการ)',
        'GAT/PAT',
        '9 วิชาสามัญ',
        'สอบวิชาเฉพาะ',
        'คะแนน O-NET ขั้นต่ำ (สำหรับบางโครงการ + กสพท)'
      ]
    },
    {
      round: '4',
      description: 'การรับแบบแอดมิชชัน',
      examReference: [
        'เกรดเฉลี่ยสะสม',
        'O-NET',
        'GAT/PAT'
      ]
    },
    {
      round: '5',
      description: 'การรับตรงอิสระ',
      examReference: [
        'เกรดเฉลี่ยขั้นต่ำ (สำหรับบางโครงการ)',
        'O-NET',
        'GAT/PAT',
        '9 วิชาสามัญ'
      ]
    }
  ];

  majorForm = new FormGroup({
    major_name: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
    tcasEntranceRound: new FormControl([], [Validators.required]),
    certificate: new FormControl(null, [Validators.required]),
    courseDuration: new FormControl(null, Validators.compose(
      [
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])
    ),
    career: new FormControl(null),
  });

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  major: Major;
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

  onSubmit() {
    console.log(this.majorForm.get('tcasEntranceRound').value);
  }

  // async onSubmit() {
  //   this.major = new Major;
  //   let listCareer = new Array<Career>();
  //   if (this.majorForm.invalid && this.selectedCareer.length === 0) return;
  //   try {
  //     this.major.major_name = this.majorForm.get('major_name').value;
  //     this.major.url = this.majorForm.get('url').value;

  //     listCareer = this.selectedCareer.map(item => {
  //       let career = new Career();
  //       career.career_name = item;
  //       return career;
  //     });

  //     this.careerService.addAllCareer(listCareer);

  //     await this.majorService.addMajor(this.data, this.major, listCareer);
  //     new Notifications().showNotification('done', 'top', 'right', 'เพิ่มข้อมูลสาขาสำเร็จแล้ว', 'success', 'สำเร็จ !');
  //   }
  //   catch (error) {
  //     new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'เพิ่มข้อมูลล้มเหลว !');
  //   }
  //   this.dialogRef.close();
  // }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listAllCareer.filter(career => career.toLowerCase().includes(filterValue));
  }
}