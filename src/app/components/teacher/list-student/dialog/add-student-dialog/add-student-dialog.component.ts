import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Login } from 'src/app/model/Login';
import { Student } from 'src/app/model/Student';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StudentService } from 'src/app/services/student-service/student.service';
import { DocumentReference, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  styleUrls: ['./add-student-dialog.component.css']
})
export class AddStudentDialogComponent implements OnInit {
  userForm = new FormGroup({
    requestData: new FormControl(false),
    username: new FormControl(null, [
      Validators.required]),
    password: new FormControl(null, [
      Validators.required]),
    conPassword: new FormControl(null, [
      Validators.required]),
    isCreateId: new FormControl(false),
  });

  studentForm = new FormGroup({
    firstname: new FormControl(null, [
      Validators.required]),
    lastname: new FormControl(null, [
      Validators.required]),
    phone_no: new FormControl(null, Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]*$')])),
    email: new FormControl(null, Validators.compose([
      Validators.required,
      Validators.pattern(`^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$`)])),
  });

  listProvince: Array<[]>;

  login: Login = new Login();
  student: Student = new Student();

  school: DocumentReference;

  imgURL: any = 'assets/img/no-photo-available.png';

  studentId: string;

  constructor(
    public dialogRef: MatDialogRef<AddStudentDialogComponent>,
    private studentService: StudentService,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: DocumentReference,
  ) {
    this.school = data;
  }

  async ngOnInit() {
    this.studentService.getStudentId().subscribe(result => {
      this.studentId = result;
      this.onCreateUsername();
    });
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  async upload(event) {
    const metadata = {
      contentType: 'image/jpeg',
    };

    const fileName = this.afirestore.createId();
    if (event.files[0].type.split('/')[0] == 'image') {
      await this.afStorage.upload(`student/${fileName}`, event.files[0], metadata).then(async result => {
        this.student.image = result.ref.fullPath;
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

  onCreateUsername() {
    if (this.userForm.get('isCreateId').value) {
      this.userForm.get('username').setValue(`student${this.studentId}`);
      this.userForm.get('username').disable({ onlySelf: true });
    } else {
      this.userForm.get('username').setValue(null);
      this.userForm.get('username').enable({ onlySelf: true });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.userForm.valid) {
      this.login.username = this.userForm.get('username').value;
      this.login.password = this.userForm.get('password').value;
      this.login.type = 'student';
      this.student.school = this.school;
      this.student.student_status = 'กำลังศึกษา';

      if (this.userForm.get('requestData').value) {
        if (this.studentForm.valid) {
          this.student.firstname = this.studentForm.get('firstname').value;
          this.student.lastname = this.studentForm.get('lastname').value;
          this.student.phone_no = this.studentForm.get('phone_no').value;
          this.student.email = this.studentForm.get('email').value;
          let files: any = document.getElementById('inputImage');
          if (files.files[0] !== undefined) {
            await this.upload(files);
          }
          this.studentService.addStudent(this.login, this.student, this.userForm.get('isCreateId').value);
          this.dialogRef.close();
        }
      } else {
        this.student.firstname = this.login.username;
        this.studentService.addStudent(this.login, this.student, this.userForm.get('isCreateId').value);
        this.dialogRef.close();
      }
    }
  }
}
