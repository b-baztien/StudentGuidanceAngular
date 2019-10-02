import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Major } from 'src/app/model/Major';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MajorService } from 'src/app/services/major-service/major.service';
import { CarrerService } from 'src/app/services/carrer-service/carrer.service';

@Component({
  selector: 'app-add-major-dialog',
  templateUrl: './add-major-dialog.component.html',
  styleUrls: ['./add-major-dialog.component.css']
})
export class AddMajorDialogComponent implements OnInit {
  majorForm = new FormGroup({
    major_name: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
    entrance_detail: new FormControl(null),
  });

  major: Major;

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

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  async onSubmit() {
    this.major = new Major;
    if (this.majorForm.valid) {
      this.major.major_name = this.majorForm.get('major_name').value;
      this.major.url = this.majorForm.get('url').value;
      this.major.entrance_detail = this.majorForm.get('entrance_detail').value;

      this.majorService.addMajor(this.data, this.major);
      this.dialogRef.close();
    }
  }
}