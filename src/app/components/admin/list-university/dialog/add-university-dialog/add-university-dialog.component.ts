import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, ErrorStateMatcher, MatAutocomplete } from '@angular/material';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Notifications } from 'src/app/components/util/notification';
import { ENTER } from '@angular/cdk/keycodes';

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

  listProvince: Array<any>;

  university: University;
  universityId;

  imgURL: any = 'assets/img/no-photo-available.png';
  albumUrl: any[] = [
    'assets/img/no-photo-available.png',
    'assets/img/no-photo-available.png',
    'assets/img/no-photo-available.png',
    'assets/img/no-photo-available.png',
    'assets/img/no-photo-available.png',
  ];

  selectable = true;
  addOnBlur = true;
  removable = true;

  separatorKeysCodes: number[] = [ENTER];

  @ViewChild('highlightInput', { static: false }) highlightInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddUniversityDialogComponent>,
    private universityService: UniversityService,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
  ) { }

  getProvinceJSON(): Observable<any> {
    return this.http.get('./assets/database/province_database.json');
  }

  ngOnInit() {
    this.listProvince = new Array<[]>();
    this.getProvinceJSON().subscribe(data => {
      this.listProvince = data;
    });
  }

  async upload(file: File, filePath: string, filename?: string) {
    const metadata = {
      contentType: 'image/jpeg',
    };

    const newFileName = filename ? filename : this.afirestore.createId();
    if (file.type.includes('image')) {
      return await this.afStorage.upload(`${filePath}/${newFileName}`, file, metadata).then(async result => {
        return result.ref.fullPath;
      });
    }
    return '';
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

  previewAlbum(event) {
    for (let i = 0; i < 5; i++) {
      if (event.target.files[i] !== undefined) {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (_event) => {
          this.albumUrl[i] = reader.result;
        }
      } else {
        this.albumUrl[i] = 'assets/img/no-photo-available.png';
      }
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
    this.universityId = this.afirestore.createId();
    try {
      if (!this.universityDetailForm.valid) return;
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
      let filePath = `university/${this.universityId}`;
      let fileLogo: any = document.getElementById('logoImage');
      if (fileLogo.files.length != 0) {
        this.university.image = await this.upload(fileLogo.files[0], filePath).then(result => {
          return result;
        });
      }
      let fileAlbum: any = document.getElementById('albumImage');
      this.university.albumImage = new Array<string>();
      for (let i = 0; i < fileAlbum.files.length; i++) {
        this.university.albumImage.push(await this.upload(fileAlbum.files[i], filePath).then(result => {
          return result;
        }));
      }
      this.universityId = await this.universityService.addUniversity(this.universityId, this.university);
      new Notifications().showNotification('done', 'top', 'right', 'เพิ่มข้อมูลมหาวิทยาลัยสำเร็จแล้ว', 'success', 'สำเร็จ !');
      this.dialogRef.close(this.universityId);
    } catch (error) {
      new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'เพิ่มข้อมูลล้มเหลว !');
    }
  }
}
