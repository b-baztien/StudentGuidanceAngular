import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Major } from 'src/app/model/Major';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-major-dialog',
  templateUrl: './add-major-dialog.component.html',
  styleUrls: ['./add-major-dialog.component.css']
})
export class AddMajorDialogComponent implements OnInit {
  majorForm = new FormGroup({
    major_name: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
  });

  major: Major;
  mode: string;

  constructor(
    public dialogRef: MatDialogRef<AddMajorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Major | null,
  ) {
    this.mode = this.data === null ? 'เพิ่ม' : 'แก้ไข';
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
      this.dialogRef.close({ major: this.major, mode: this.mode });
    }
  }
}