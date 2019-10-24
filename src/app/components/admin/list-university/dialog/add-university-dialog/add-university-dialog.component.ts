import { Component, OnInit } from '@angular/core';
import { MatDialogRef, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Notifications } from 'src/app/components/util/notification';

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

  imgURL: any = 'assets/img/no-photo-available.png';

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddUniversityDialogComponent>,
    private universityService: UniversityService,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
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

  async upload(event) {
    const metadata = {
      contentType: 'image/jpeg',
    };

    const fileName = this.afirestore.createId();
    if (event.files[0].type.split('/')[0] == 'image') {
      await this.afStorage.upload(`university/${fileName}`, event.files[0], metadata).then(async result => {
        this.university.image = await result.ref.fullPath;
      });
    }
  }

  preview(event) {
    if (event.target.files[0] !== undefined) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    } else {
      this.imgURL = 'assets/img/no-photo-available.png';
    }
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  async onSubmit() {
    this.university = new University();
    try {
      if (this.universityDetailForm.valid) {
        this.university.university_name = this.universityDetailForm.get('university_name').value;
        this.university.address = this.universityAddressForm.get('address').value;
        this.university.tambon = this.universityAddressForm.get('tambon').value;
        this.university.amphur = this.universityAddressForm.get('amphur').value;
        this.university.province = this.universityAddressForm.get('province').value.province_name;
        this.university.zipcode = this.universityAddressForm.get('zipcode').value;
        this.university.url = this.universityDetailForm.get('url').value;
        this.university.phone_no = this.universityDetailForm.get('phone_no').value;
        this.university.university_detail = this.universityDetailForm.get('university_detail').value;
        this.university.zone = this.universityAddressForm.get('province').value.zone;
        this.university.view = 0;
        let files: any = document.getElementById('logoImage');
        if (files.files[0] !== undefined) {
          await this.upload(files);
        }
        const universityId = await this.universityService.addUniversity(this.university);
        new Notifications().showNotification('done', 'top', 'right', 'เพิ่มข้อมูลมหาวิทยาลัยสำเร็จแล้ว', 'success', 'สำเร็จ !');
        this.dialogRef.close(universityId);
      }
    } catch (error) {
      new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'เพิ่มข้อมูลล้มเหลว !');
    }
  }
}
