import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { Faculty } from 'src/app/model/Faculty';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { flutterMeterialIcons, UtilIcons } from 'src/app/model/util/UtilIcons';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-faculty-dialog',
  templateUrl: './add-edit-faculty-dialog.component.html',
  styleUrls: ['./add-edit-faculty-dialog.component.css']
})
export class AddEditFacultyDialogComponent implements OnInit, ErrorStateMatcher {
  icons: UtilIcons[] = flutterMeterialIcons;

  facultyForm = new FormGroup({
    faculty_name: new FormControl(this.data === null ? null : this.data.faculty_name, [
      Validators.required]),
    url: new FormControl(this.data === null ? null : this.data.url, [
      Validators.required]),
    facultyIcon: new FormControl(
      this.data === null ? null : this.icons.filter(icon => icon.name === this.data.facultyIcon.name
      )[0].name, [Validators.required]),
  });

  mode: string;


  constructor(
    public dialogRef: MatDialogRef<AddEditFacultyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Faculty | null,
  ) {
    this.mode = this.data === null ? 'เพิ่ม' : 'แก้ไข';
  }

  ngOnInit() { }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  async onSubmit() {
    let faculty = new Faculty();
    if (this.facultyForm.invalid) return;
    faculty.faculty_name = this.facultyForm.controls.faculty_name.value;
    faculty.url = this.facultyForm.controls.url.value;
    faculty.facultyIcon = this.icons.filter(icon => icon.name === this.facultyForm.controls.facultyIcon.value)[0];
    this.dialogRef.close({ faculty: faculty, mode: this.mode });
  }
}
