import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { University } from 'src/app/model/University';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddUniversityDialogComponent } from '../../../list-university/dialog/add-university-dialog/add-university-dialog.component';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-edit-university-dialog',
  templateUrl: './edit-university-dialog.component.html',
  styleUrls: ['./edit-university-dialog.component.css']
})
export class EditUniversityDialogComponent implements OnInit {
  universityDetailForm = new FormGroup({
    university_name: new FormControl(this.data.university.university_name, [
      Validators.required]),
    url: new FormControl(this.data.university.url, [
      Validators.required]),
    phone_no: new FormControl(this.data.university.phone_no, Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]*$')])),
    university_detail: new FormControl(this.data.university.university_detail),
  });

  universityAddressForm = new FormGroup({
    address: new FormControl(this.data.university.address, [
      Validators.required]),
    tambon: new FormControl(this.data.university.tambon, [
      Validators.required]),
    amphur: new FormControl(this.data.university.amphur, [
      Validators.required]),
    province: new FormControl(this.data.university.province, [
      Validators.required]),
    zipcode: new FormControl(this.data.university.zipcode, Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]{5}$')])),
  });

  listProvince;

  university: University;

  imgURL: any = 'assets/img/no-photo-available.png';

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddUniversityDialogComponent>,
    private universityService: UniversityService,
    private afStorage: AngularFireStorage,
    @Inject(MAT_DIALOG_DATA) public data: { universityId: string, university: University },
  ) {
    this.university = data.university;
  }

  getProvinceJSON(): Observable<any> {
    return this.http.get('./assets/database/province_database.json');
  }

  ngOnInit() {
    this.listProvince = new Array<[any]>();
    this.getProvinceJSON().subscribe(data => {
      this.listProvince = data;
    });

    this.afStorage.storage.ref(this.university.image).getDownloadURL().then(url => {
      this.imgURL = url;
    });

    this.dialogRef.disableClose = true;
  }

  async upload(event) {
    const metadata = {
      contentType: 'image/jpeg',
    };

    const fileName = event.files[0].name;
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
      this.afStorage.storage.ref(this.university.image).getDownloadURL().then(url => {
        this.imgURL = url;
      });
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
        this.university.province = this.universityAddressForm.get('province').value;
        this.university.zipcode = this.universityAddressForm.get('zipcode').value;
        this.university.zone = this.universityAddressForm.get('province').value.zone;
        this.university.url = this.universityDetailForm.get('url').value;
        this.university.phone_no = this.universityDetailForm.get('phone_no').value;
        this.university.university_detail = this.universityDetailForm.get('university_detail').value;
        this.listProvince.forEach(provinceRes => {
          if (this.university.province == provinceRes.province_name) {
            this.university.zone = provinceRes.zone;
          }
        });
        this.university.view = 0;
        const imgFile: any = document.getElementById('logoImage');
        if (imgFile.files[0] !== undefined) {
          await this.upload(imgFile);
        }
        const universityId = await this.universityService.updateUniversity(this.data.universityId, this.university);
        this.dialogRef.close(universityId);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
