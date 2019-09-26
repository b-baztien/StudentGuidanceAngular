import { Component, OnInit } from '@angular/core';
import { University } from 'src/app/model/University';
import { FormGroupDirective, FormControl, NgForm, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {
  universityDetailForm = new FormGroup({
    university_name: new FormControl(null, [
      Validators.required]),
    url: new FormControl(null, [
      Validators.required]),
    phone_no: new FormControl(null, Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]*$')])),
    university_detail: new FormControl(null),
  });

  universityAddressForm = new FormGroup({
    address: new FormControl(null, [
      Validators.required]),
    tambon: new FormControl(null, [
      Validators.required]),
    amphur: new FormControl(null, [
      Validators.required]),
    province: new FormControl(null, [
      Validators.required]),
    zipcode: new FormControl(null, Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]{5}$')])),
  });

  listProvince: Array<[]>;

  university: University;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private universityService: UniversityService
  ) { }

  getProvinceJSON(): Observable<any> {
    return this.http.get('./assets/database/province_database.json');
  }

  ngOnInit() {
    this.listProvince = new Array<[]>();
    this.getProvinceJSON().subscribe(data => {
      this.listProvince = data;
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
      this.university.zone = this.universityAddressForm.get('province').value.zone;
      this.university.view = 0;
      this.universityService.addUniversity(this.university)
      // this.dialogRef.close(this.universityService.addUniversity(this.university));
    }
  }
}
