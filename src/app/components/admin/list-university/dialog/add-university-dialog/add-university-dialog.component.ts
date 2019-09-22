import { Component, OnInit } from '@angular/core';
import { MatDialogRef, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-add-university-dialog',
  templateUrl: './add-university-dialog.component.html',
  styleUrls: ['./add-university-dialog.component.css']
})
export class AddUniversityDialogComponent implements OnInit, ErrorStateMatcher {
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
    public dialogRef: MatDialogRef<AddUniversityDialogComponent>,
    private universityService: UniversityService
  ) {
  }

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
