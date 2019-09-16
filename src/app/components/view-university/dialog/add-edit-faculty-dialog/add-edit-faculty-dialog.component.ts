import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { Major } from 'src/app/model/Major';
import { FacultyService } from 'src/app/services/faculty-service/faculty.service';
import { Faculty } from 'src/app/model/Faculty';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-add-edit-faculty-dialog',
  templateUrl: './add-edit-faculty-dialog.component.html',
  styleUrls: ['./add-edit-faculty-dialog.component.css']
})
export class AddEditFacultyDialogComponent implements OnInit, ErrorStateMatcher {
  facultyForm = new FormGroup({
    faculty_name: new FormControl(this.data.faculty_name, [
      Validators.required]),
    url: new FormControl(this.data.url, [
      Validators.required]),
  });

  faculty: Faculty;

  constructor(
    private facultyService: FacultyService,
    public dialogRef: MatDialogRef<AddEditFacultyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Faculty,
  ) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    this.faculty = new Faculty();
    if (this.facultyForm.valid) {
      this.faculty.faculty_name = this.facultyForm.get('faculty_name').value;
      this.faculty.url = this.facultyForm.get('url').value;

      this.dialogRef.close(this.faculty);
    }
  }
}
