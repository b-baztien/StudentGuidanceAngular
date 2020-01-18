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
import { DocumentSnapshot } from '@angular/fire/firestore';
import { Tcas } from 'src/app/model/Tcas';
import { Notifications } from 'src/app/components/util/notification';

@Component({
  selector: 'app-edit-major',
  templateUrl: './edit-major.component.html',
  styleUrls: ['./edit-major.component.css']
})
export class EditMajorComponent implements OnInit {
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
    majorName: new FormControl(null, [Validators.required]),
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

  majorDoc: DocumentSnapshot<unknown>;
  selectedCareer: string[] = new Array<string>();
  listAllCareerName: string[] = new Array<string>();
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
    private careerService: CareerService,
    @Inject(MAT_DIALOG_DATA) public data: Major,
  ) { }

  ngOnInit() {
    this.majorForm.get('majorName').setValue(this.data.majorName);
    this.majorForm.get('url').setValue(this.data.url);
    this.majorForm.get('certificate').setValue(this.data.certificate);
    this.majorForm.get('courseDuration').setValue(this.data.courseDuration);
    this.majorForm.get('career').setValue(this.data.listCareerName);
    this.selectedCareer = this.data.listCareerName;
    this.majorForm.get('tcasEntranceRound').setValue(this.data.tcasEntranceRound.map(tcas => tcas.round));

    this.careerService.getAllCareer().subscribe(listCareerRes => {
      listCareerRes.forEach(careerRes => {
        const career = careerRes.data() as Career;
        this.listAllCareerName.push(career.career_name);
      })
      this.loadData = true;
    })
    this.filteredCareer = this.majorForm.get('career').valueChanges.pipe(
      startWith(null),
      map((career: string | null) => career ? this._filter(career) : this.listAllCareerName.slice()));
  }

  ngAfterViewInit() {
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  getTcas(round: string) {
    return this.tcasRound.filter(tcas => tcas.round === round)[0];
  }


  addCareer(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
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
    if (this.majorForm.invalid && this.selectedCareer.length === 0) return;
    major.majorName = this.majorForm.get('majorName').value;
    major.url = this.majorForm.get('url').value;
    major.certificate = this.majorForm.get('certificate').value;
    major.courseDuration = this.majorForm.get('courseDuration').value;
    major.tcasEntranceRound = this.majorForm.get('tcasEntranceRound').value.map(round => {
      return this.tcasRound.filter(tcas => tcas.round === round)[0];
    });

    major.listCareerName = this.selectedCareer;

    this.dialogRef.close(major);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listAllCareerName.filter(career => career.toLowerCase().includes(filterValue));
  }
}
