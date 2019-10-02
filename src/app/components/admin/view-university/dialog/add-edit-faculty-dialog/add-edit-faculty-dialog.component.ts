import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FacultyService } from 'src/app/services/faculty-service/faculty.service';
import { Faculty } from 'src/app/model/Faculty';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-edit-faculty-dialog',
  templateUrl: './add-edit-faculty-dialog.component.html',
  styleUrls: ['./add-edit-faculty-dialog.component.css']
})
export class AddEditFacultyDialogComponent implements OnInit, ErrorStateMatcher {
  facultyForm = new FormGroup({
    faculty_name: new FormControl(this.data === null ? null : this.data.faculty_name, [
      Validators.required]),
    url: new FormControl(this.data === null ? null : this.data.url, [
      Validators.required]),
  });

  faculty: Faculty;
  mode: string;

  constructor(
    private facultyService: FacultyService,
    public dialogRef: MatDialogRef<AddEditFacultyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Faculty | null,
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
    this.faculty = new Faculty;
    if (this.facultyForm.valid) {
      this.faculty.faculty_name = this.facultyForm.get('faculty_name').value;
      this.faculty.url = this.facultyForm.get('url').value;
      this.dialogRef.close({faculty: this.faculty, mode: this.mode});
    }
  }
}
