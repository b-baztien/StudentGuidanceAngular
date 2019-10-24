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
    requestData: new FormControl(false),
    username: new FormControl(null, [
      Validators.required]),
    password: new FormControl(null, [
      Validators.required]),
    conPassword: new FormControl(null, [
      Validators.required]),
    isCreateId: new FormControl(false),
  });

  teacherForm = new FormGroup({
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

  login: Login = new Login();
  teacher: Teacher = new Teacher();
  student: Student = new Student();

  school: School = new School();

  imgURL: any = 'assets/img/no-photo-available.png';

  teacherId: string;
  studentId: string;

  filteredSchool: Observable<string[]>;
  listSchool: string[] = new Array<string>();

  loadData = false;

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
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

    this.teacherService.getTeacherId().subscribe(result => {
      this.teacherId = result;
      this.onCreateUsername();
    });

    this.studentService.getStudentId().subscribe(result => {
      this.studentId = result;
      this.onCreateUsername();
    });

    await this.schoolService.getAllSchool().subscribe(listSchoolRes => {
      listSchoolRes.forEach(schoolRes => {
        const school = schoolRes.payload.doc.data() as School;
        this.listSchool.push(school.school_name);
      }),
        this.loadData = true;
    }),
      this.filteredSchool = this.userForm.get('school').valueChanges.pipe(
        startWith(null),
        map((school: string | null) => school ? this._filter(school) : this.listSchool.slice()));

    this.dialogRef.disableClose = true;
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
      if (this.userForm.get('userType').value === 'teacher') {
        await this.afStorage.upload(`teacher/${fileName}`, event.files[0], metadata).then(async result => {
          this.teacher.image = await result.ref.fullPath;
        });
      } else if (this.userForm.get('userType').value === 'student') {
        await this.afStorage.upload(`student/${fileName}`, event.files[0], metadata).then(async result => {
          this.student.image = await result.ref.fullPath;
        });
      }
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
      if (this.userForm.get('userType').value === 'teacher') {
        this.userForm.get('username').setValue(`teacher${this.teacherId}`);
        this.userForm.get('username').disable({ onlySelf: true });
      } else if (this.userForm.get('userType').value === 'student') {
        this.userForm.get('username').setValue(`student${this.studentId}`);
        this.userForm.get('username').disable({ onlySelf: true });
      }
    } else {
      this.userForm.get('username').setValue(null);
      this.userForm.get('username').enable({ onlySelf: true });
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.userForm.get('school').setValue(event.option.viewValue);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.userForm.valid) {
      this.login.username = this.userForm.get('username').value;
      this.login.password = this.userForm.get('password').value;
      this.login.password = this.userForm.get('userType').value;
      this.school.school_name = this.userForm.get('school').value;

      if (this.userForm.get('requestData').value) {
        if (this.userForm.get('userType').value === 'teacher') {
          this.teacher.school = await this.schoolService.addSchool(this.school).then(result => {
            return result;
          });
          if (this.teacherForm.valid) {
            this.teacher.firstname = this.teacherForm.get('firstname').value;
            this.teacher.lastname = this.teacherForm.get('lastname').value;
            this.teacher.phone_no = this.teacherForm.get('phone_no').value;
            this.teacher.email = this.teacherForm.get('email').value;
            let files: any = document.getElementById('logoImage');
            if (files.files[0] !== undefined) {
              await this.upload(files);
            }
            this.teacherService.addTeacher(this.login, this.teacher, this.userForm.get('isCreateId').value);
            this.dialogRef.close();
          }
        } else if (this.userForm.get('userType').value === 'student') {
          this.student.school = await this.schoolService.addSchool(this.school).then(result => {
            return result;
          });
          if (this.studentForm.valid) {
            this.student.firstname = this.studentForm.get('firstname').value;
            this.student.lastname = this.studentForm.get('lastname').value;
            this.student.phone_no = this.studentForm.get('phone_no').value;
            this.student.email = this.studentForm.get('email').value;
            let files: any = document.getElementById('logoImage');
            if (files.files[0] !== undefined) {
              await this.upload(files);
            }
            this.studentService.addStudent(this.login, this.student, this.userForm.get('isCreateId').value);
            this.dialogRef.close();
          }
        }
      } else {
        if (this.userForm.get('userType').value === 'teacher') {
          this.teacher.school = await this.schoolService.addSchool(this.school).then(result => {
            return result;
          });
          this.teacherService.addTeacher(this.login, this.teacher, this.userForm.get('isCreateId').value);
          this.dialogRef.close();
        } else if (this.userForm.get('userType').value === 'student') {
          this.student.school = await this.schoolService.addSchool(this.school).then(result => {
            return result;
          });
          this.studentService.addStudent(this.login, this.student, this.userForm.get('isCreateId').value);
          this.dialogRef.close();
        }
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listSchool.filter(school => school.toLowerCase().includes(filterValue));
  }
}