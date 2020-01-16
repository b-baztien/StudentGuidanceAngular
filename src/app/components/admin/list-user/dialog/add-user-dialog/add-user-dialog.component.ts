import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, FormControl, NgForm, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { TeacherService } from 'src/app/services/teacher-service/teacher.service';
import { Login } from 'src/app/model/Login';
import { Teacher } from 'src/app/model/Teacher';
import { Student } from 'src/app/model/Student';
import { SchoolService } from 'src/app/services/school-service/school.service';
import { School } from 'src/app/model/School';
import { startWith, map } from 'rxjs/operators';
import { StudentService } from 'src/app/services/student-service/student.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoginService } from 'src/app/services/login-service/login.service';
import { Notifications } from 'src/app/components/util/notification';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {
  userForm = new FormGroup({
    userType: new FormControl('teacher', [
      Validators.required]),
    school: new FormControl(null, [
      Validators.required]),
    username: new FormControl(null, [
      Validators.required]),
    password: new FormControl(null, [
      Validators.required]),
    conPassword: new FormControl(null, [
      Validators.required]),
  });

  teacherForm = new FormGroup({
    firstname: new FormControl(null, [
      Validators.required]),
    lastname: new FormControl(null, [
      Validators.required]),
    position: new FormControl(null, [
      Validators.required]),
    phone_no: new FormControl(null, Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]*$')])),
    email: new FormControl(null, Validators.compose([
      Validators.required,
      Validators.email
    ])),
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
      Validators.email,
    ])),
  });

  listProvince: Array<[]>;

  school: School = new School();

  imgURL: any = 'assets/img/no-photo-available.png';

  teacherId: string;
  studentId: string;

  filteredSchool: Observable<School[]>;
  listSchool = new Array<School>();

  loadData = false;

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private loginService: LoginService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private schoolService: SchoolService,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
  ) { }

  getProvinceJSON(): Observable<any> {
    return this.http.get('./assets/database/province_database.json');
  }

  async ngOnInit() {
    this.listProvince = new Array<[]>();
    this.getProvinceJSON().subscribe(data => {
      this.listProvince = data;
    });

    this.getSchoolData();
    this.filteredSchool = this.userForm.get('school').valueChanges.pipe(
      startWith(null),
      map((schoolName: string | null) => schoolName ? this._filter(schoolName) : this.listSchool.slice()));
  }

  private getSchoolData() {
    this.schoolService.getAllSchool().subscribe(listSchoolRes => {
      this.listSchool = listSchoolRes.map(school => {
        return { id: school.id, ref: school.ref, ...school.data() as School }
      });
      this.loadData = true;
    });
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
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

  selected(event: MatAutocompleteSelectedEvent): void {
    this.userForm.get('school').setValue(event.option.viewValue);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    try {
      let login = new Login();
      if (this.userForm.valid) {
        login.username = this.userForm.get('username').value;
        login.password = this.userForm.get('password').value;
        login.type = this.userForm.get('userType').value;
        let school = this.listSchool
          .find(school => school.school_name === this.userForm.get('school').value);

        await this.loginService.getLoginByCondition(
          query => query.where('username', '==', login.username)
        ).toPromise().then(result => {
          if (result.length > 0) return new Error('มีชื่อผู้ใช้นี้ในระบบแล้ว')
        });

        if (this.userForm.get('userType').value === 'teacher') {
          if (this.teacherForm.valid) {
            let teacher = new Teacher();
            teacher.firstname = this.teacherForm.get('firstname').value;
            teacher.lastname = this.teacherForm.get('lastname').value;
            teacher.phone_no = this.teacherForm.get('phone_no').value;
            teacher.email = this.teacherForm.get('email').value;
            let files: any = document.getElementById('inputImage');
            if (files.files.length !== 0) {
              await this.upload(files, 'teacher');
            }
            if (!school) {
              console.log(school);
              school.school_name = this.userForm.get('school').value;
              // school.ref = (await this.schoolService.addSchool(school));
            }
            this.teacherService.addTeacher(school.ref, login, teacher);
            this.loginService.addUser(login).then(loginRef => {
              teacher.login = loginRef;
            });
            this.dialogRef.close({
              userType: this.userForm.controls.userType.value,
              school: school.ref,
              login: login,
              teacher: teacher
            });
          }
        }
        // else if (this.userForm.get('userType').value === 'student') {
        //   this.student.school = await this.schoolService.addSchool(this.school).then(result => {
        //     return result;
        //   });
        //   if (this.studentForm.valid) {
        //     this.student.firstname = this.studentForm.get('firstname').value;
        //     this.student.lastname = this.studentForm.get('lastname').value;
        //     this.student.phone_no = this.studentForm.get('phone_no').value;
        //     this.student.email = this.studentForm.get('email').value;
        //     let files: any = document.getElementById('inputImage');
        //     if (files.files.length !== 0) {
        //       await this.upload(files, 'student');
        //     }
        //     this.loginService.addUser(this.login).then(loginRef => {
        //       this.student.login = loginRef;
        //       this.studentService.addStudent(this.login, this.student);
        //     });
        //     this.dialogRef.close();
        //   }
        // }
      }
    } catch (error) {
      new Notifications().showNotification('close', 'top', 'right', error.message, 'danger', 'ลบข้อมูลล้มเหลว !');
    }
  }

  private _filter(value: string): School[] {
    const filterValue = value.toLowerCase();
    return this.listSchool.filter(school => school.school_name.toLowerCase().includes(filterValue));
  }
}