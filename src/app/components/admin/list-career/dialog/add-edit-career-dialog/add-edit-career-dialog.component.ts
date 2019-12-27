import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Career } from 'src/app/model/Career';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-edit-career-dialog',
  templateUrl: './add-edit-career-dialog.component.html',
  styleUrls: ['./add-edit-career-dialog.component.css']
})
export class AddEditCareerDialogComponent implements OnInit {
  careerForm = new FormGroup({
    career_name: new FormControl(null, [
      Validators.required]),
    description: new FormControl(null),
  });

  career: Career;
  mode: string;

  imgURL: any = 'assets/img/no-photo-available.png';

  showData = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditCareerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Career | null,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
  ) {
    this.mode = this.data === null ? 'เพิ่ม' : 'แก้ไข';
  }

  async ngOnInit() {
    if (this.mode == 'แก้ไข') {
      this.career = this.data;
      this.careerForm.get('career_name').setValue(this.career.career_name);
      if (this.career.description) {
        this.careerForm.get('description').setValue(this.career.description);
      }
      if (this.career.image) {
        await this.afStorage.storage.ref(this.career.image).getDownloadURL().then(url => {
          this.imgURL = url;
        });
      }
    }
    this.showData = true;
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
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
      this.imgURL = 'assets/img/no-photo-available.png';
    }
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  async onSubmit() {
    if (this.careerForm.valid) {
      this.career.career_name = this.careerForm.get('career_name').value;
      this.career.description = this.careerForm.get('description').value;

      let filePath = `career`;
      let fileLogo: any = document.getElementById('logoImage');
      if (fileLogo.files[0] !== undefined) {
        this.career.image = await this.upload(fileLogo, filePath).then(result => {
          return result;
        });
      }

      this.dialogRef.close({ career: this.career, mode: this.mode });
    }
  }
}
