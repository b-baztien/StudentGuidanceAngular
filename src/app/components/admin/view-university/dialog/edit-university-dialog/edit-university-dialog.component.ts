import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { University } from 'src/app/model/University';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddUniversityDialogComponent } from '../../../list-university/dialog/add-university-dialog/add-university-dialog.component';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Notifications } from 'src/app/components/util/notification';
import { ENTER } from '@angular/cdk/keycodes';
import { startWith, map } from 'rxjs/operators';

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
    highlight: new FormControl(null),
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
  universityId: string;

  imgURL: any = 'assets/img/no-photo-available.png';
  albumUrl: any[] = [
    'assets/img/no-photo-available.png',
    'assets/img/no-photo-available.png',
    'assets/img/no-photo-available.png',
    'assets/img/no-photo-available.png',
    'assets/img/no-photo-available.png',
  ];

  listHighlight: string[] = new Array<string>();
  allHighlight: string[] = new Array<string>();
  filteredHighlight: Observable<string[]>;

  selectable = true;
  addOnBlur = true;
  removable = true;

  separatorKeysCodes: number[] = [ENTER];

  @ViewChild('highlightInput', { static: false }) highlightInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  showData = false;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddUniversityDialogComponent>,
    private universityService: UniversityService,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: { universityId: string, university: University },
  ) {
    this.university = data.university;
    this.universityId = data.universityId;
  }

  getProvinceJSON(): Observable<any> {
    return this.http.get('./assets/database/province_database.json');
  }

  ngOnInit() {
    this.listProvince = new Array<[any]>();
    this.getProvinceJSON().subscribe(data => {
      this.listProvince = data;
    });

    if (this.university.image) {
      this.afStorage.storage.ref(this.university.image).getDownloadURL().then(url => {
        this.imgURL = url;
      });
    }

    if (this.university.albumImage) {
      for (let i = 0; i < this.university.albumImage.length; i++) {
        this.afStorage.storage.ref(this.university.albumImage[i]).getDownloadURL().then(url => {
          this.albumUrl[i] = url;
        });
      }
    }

    if (this.university.highlight !== undefined) {
      this.university.highlight.forEach(highlight => {
        this.listHighlight.push(highlight);
      });
    }

    let hlSet = new Set<string>();
    this.universityService.getAllUniversity().subscribe(result => {
      for (let i = 0; i < result.docs.length; i++) {
        let uni = result[i].payload.doc.data() as University;
        if (uni.highlight != undefined) {
          uni.highlight.forEach(hl => {
            hlSet.add(hl);
          });
        }
      }
      this.allHighlight = Array.from(hlSet);
      this.showData = true;
    });

    this.filteredHighlight = this.universityDetailForm.get('highlight').valueChanges.pipe(
      startWith(null),
      map((highlight: string | null) => highlight ? this._filter(highlight) : this.allHighlight.slice()));
  }

  async upload(file, filePath) {
    const metadata = {
      contentType: 'image/jpeg',
    };

    const fileName = this.afirestore.createId();
    if (file.type.split('/')[0] == 'image') {
      return await this.afStorage.upload(`${filePath}/${fileName}`, file, metadata).then(async result => {
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
      this.afStorage.storage.ref(this.university.image).getDownloadURL().then(url => {
        this.imgURL = url;
      });
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
        this.university.highlight = this.listHighlight;
        let filePath = `university/${this.universityId}`;
        let fileLogo: any = document.getElementById('logoImage');
        if (fileLogo.files.length != 0) {
          if (this.university.image !== undefined) {
            await this.afStorage.storage.ref(this.university.image).delete();
          }
          this.university.image = await this.upload(fileLogo.files[0], filePath).then(async result => {
            return await result;
          });
        }
        let fileAlbum: any = document.getElementById('albumImage');
        this.university.albumImage = this.university.albumImage === undefined ? new Array<string>() : this.university.albumImage;
        for (let i = 0; i < fileAlbum.files.length; i++) {
          if (this.university.albumImage[i] !== undefined) {
            await this.afStorage.storage.ref(this.university.albumImage[i]).delete();
            this.university.albumImage[i] = await this.upload(fileAlbum.files[i], filePath).then(result => {
              return result;
            });
          } else {
            this.university.albumImage.push(await this.upload(fileAlbum.files[i], filePath).then(result => {
              return result;
            }));
          }
        }
        const universityId = await this.universityService.updateUniversity(this.data.universityId, this.university);
        new Notifications().showNotification('done', 'top', 'right', 'แก้ไขข้อมูลมหาวิทยาลัยสำเร็จแล้ว', 'success', 'สำเร็จ !');
        this.dialogRef.close(universityId);
      }
    } catch (error) {
      console.error(error);
      new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'แก้ไขข้อมูลล้มเหลว !');
    }
  }

  addHighlight(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.listHighlight.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.universityDetailForm.get('highlight').setValue(null);
    }
  }

  clearHighlight(): void {
    this.highlightInput.nativeElement.value = null;
    this.universityDetailForm.get('highLight').setValue(null);
  }

  removeHighlight(highlight: string): void {
    const index = this.listHighlight.indexOf(highlight);

    if (index >= 0) {
      this.listHighlight.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.listHighlight.push(event.option.viewValue);
    this.highlightInput.nativeElement.value = null;
    this.universityDetailForm.get('highlight').setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allHighlight.filter(highlight => highlight.toLowerCase().includes(filterValue));
  }
}