import { Component, OnInit } from '@angular/core';
import { MatDialogRef, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';

@Component({
  selector: 'app-add-university-dialog',
  templateUrl: './add-university-dialog.component.html',
  styleUrls: ['./add-university-dialog.component.css']
})
export class AddUniversityDialogComponent implements OnInit, ErrorStateMatcher {
  universityForm = new FormGroup({
    university_name: new FormControl(null, [
      Validators.required]),
    address: new FormControl(null, [
      Validators.required]),
    url: new FormControl(null, [
      Validators.required]),
    phone_no: new FormControl(null, Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]*$')])),
    university_detail: new FormControl(null),
    zone: new FormControl(null, [
      Validators.required]),
  });

  university: University;

  constructor(public dialogRef: MatDialogRef<AddUniversityDialogComponent>, private universityService: UniversityService) {
  }

  async ngOnInit() {

  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    this.university = new University();
    if (this.universityForm.valid) {
      this.university.university_name = this.universityForm.get('university_name').value;
      this.university.address = this.universityForm.get('address').value;
      this.university.url = this.universityForm.get('url').value;
      this.university.phone_no = this.universityForm.get('phone_no').value;
      this.university.university_detail = this.universityForm.get('university_detail').value;
      this.university.zone = this.universityForm.get('zone').value;
      this.university.view = 0;

      this.dialogRef.close(this.universityService.addUniversity(this.university));
    }
  }
}
