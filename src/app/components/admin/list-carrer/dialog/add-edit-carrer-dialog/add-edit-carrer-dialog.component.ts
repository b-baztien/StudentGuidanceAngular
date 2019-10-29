import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Carrer } from 'src/app/model/Carrer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-edit-carrer-dialog',
  templateUrl: './add-edit-carrer-dialog.component.html',
  styleUrls: ['./add-edit-carrer-dialog.component.css']
})
export class AddEditCarrerDialogComponent implements OnInit {
  carrerForm = new FormGroup({
    carrer_name: new FormControl(null, [
      Validators.required]),
    description: new FormControl(null),
  });

  carrer: Carrer;
  mode: string;

  imgURL: any = 'assets/img/no-photo-available.png';

  showData = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditCarrerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Carrer | null,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
  ) {
    this.mode = this.data === null ? 'เพิ่ม' : 'แก้ไข';
  }

  async ngOnInit() {
    if (this.mode == 'แก้ไข') {
      this.carrer = this.data;
      this.carrerForm.get('carrer_name').setValue(this.carrer.carrer_name);
      if (this.carrer.description) {
        this.carrerForm.get('description').setValue(this.carrer.description);
      }
      if (this.carrer.image) {
        await this.afStorage.storage.ref(this.carrer.image).getDownloadURL().then(url => {
          this.imgURL = url;
        });
      }
    }
    this.showData = true;
    this.dialogRef.disableClose = true;
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  async upload(event, path: string, fileName?: string) {
    const metadata = {
      contentType: 'image/jpeg',
    };

    fileName = fileName ? fileName : this.afirestore.createId();
    if (event.files[0].type.split('/')[0] == 'image') {
      return await this.afStorage.upload(`${path}/${fileName}`, event.files[0], metadata).then(async result => {
        return await result.ref.fullPath;
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

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  async onSubmit() {
    if (this.carrerForm.valid) {
      this.carrer.carrer_name = this.carrerForm.get('carrer_name').value;
      this.carrer.description = this.carrerForm.get('description').value;

      let filePath = `carrer`;
      let fileLogo: any = document.getElementById('logoImage');
      if (fileLogo.files[0] !== undefined) {
        this.carrer.image = await this.upload(fileLogo, filePath, this.carrer.carrer_name).then(result => {
          return result;
        });
      }

      this.dialogRef.close({ carrer: this.carrer, mode: this.mode });
    }
  }
}
