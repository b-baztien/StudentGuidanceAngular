import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { FacultyService } from 'src/app/services/faculty-service/faculty.service';
import { Faculty } from 'src/app/model/Faculty';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddEditFacultyDialogComponent } from '../add-edit-faculty-dialog/add-edit-faculty-dialog.component';
import { University } from 'src/app/model/University';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddUniversityDialogComponent } from '../../../list-university/dialog/add-university-dialog/add-university-dialog.component';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { reverse } from 'dns';

@Component({
  selector: 'app-edit-university-dialog',
  templateUrl: './edit-university-dialog.component.html',
  styleUrls: ['./edit-university-dialog.component.css']
})
export class EditUniversityDialogComponent implements OnInit {
  universityDetailForm = new FormGroup({
    university_name: new FormControl(this.data.university_name, [
      Validators.required]),
    url: new FormControl(this.data.url, [
      Validators.required]),
    phone_no: new FormControl(this.data.phone_no, Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]*$')])),
    university_detail: new FormControl(this.data.university_detail),
  });

  universityAddressForm = new FormGroup({
    address: new FormControl(this.data.address, [
      Validators.required]),
    tambon: new FormControl(this.data.tambon, [
      Validators.required]),
    amphur: new FormControl(this.data.amphur, [
      Validators.required]),
    province: new FormControl(this.data.province, [
      Validators.required]),
    zipcode: new FormControl(this.data.zipcode, Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]{5}$')])),
  });

  listProvince;

  university: University;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditUniversityDialogComponent>,
    private universityService: UniversityService,
    @Inject(MAT_DIALOG_DATA) public data: University,
  ) {
    this.university = data;
  }

  getProvinceJSON(): Observable<any> {
    return this.http.get('./assets/database/province_database.json');
  }

  ngOnInit() {
    this.listProvince;
    this.getProvinceJSON().subscribe(data => {
      this.listProvince = data;
      console.log(data[0]);
    });

    this.dialogRef.disableClose = true;
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.university = new University();
    if (this.universityDetailForm.valid) {
      this.university.university_name = this.universityDetailForm.get('university_name').value;
      this.university.address =
        `${this.universityAddressForm.get('address').value} ตำบล${this.universityAddressForm.get('tambon').value} อำเภอ${this.universityAddressForm.get('amphur').value} จังหวัด${this.universityAddressForm.get('province').value.province_name} ${this.universityAddressForm.get('zipcode').value}`;
      this.university.zone = this.universityAddressForm.get('province').value.zone;
      this.university.url = this.universityDetailForm.get('url').value;
      this.university.phone_no = this.universityDetailForm.get('phone_no').value;
      this.university.university_detail = this.universityDetailForm.get('university_detail').value;
      this.university.zone = this.listProvince.filter((result) => result.province_name === this.universityAddressForm.get('province').value)[0].zone;
      this.university.view = 0;
      this.universityService.addUniversity(this.university)
      // this.dialogRef.close(this.universityService.addUniversity(this.university));
    }
  }
}
