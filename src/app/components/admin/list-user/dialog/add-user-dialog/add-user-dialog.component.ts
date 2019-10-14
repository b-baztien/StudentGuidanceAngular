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
      Validators.pattern(`^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$`)])),
  });

  listProvince: Array<[]>;

  login: Login;
  teacher: Teacher;
  student: Student;

  school: School;

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
    private schoolService: SchoolService,
  ) { }

  getProvinceJSON(): Observable<any> {
    return this.http.get('./assets/database/province_database.json');
  }

  async ngOnInit() {
    this.listProvince = new Array<[]>();
    this.getProvinceJSON().subscribe(data => {
      this.listProvince = data;
    });

    this.teacherService.generateTeacherId().subscribe(result => {
      this.teacherId = result;
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
    this.teacher = new Teacher();
    this.school = new School();
    if (this.userForm.valid) {
      if (this.userForm.get('requestData').value) {
        this.login.username = this.userForm.get('username').value;
        this.login.password = this.userForm.get('password').value;
        this.login.password = this.userForm.get('userType').value;
        if (this.userForm.get('userType').value === 'teacher') {
          this.teacher.school = await this.schoolService.addSchool(this.school).then(result => {
            return result;
          });
          if (this.teacherForm.valid) {
            this.teacher.firstname = this.teacherForm.get('firstname').value;
            this.teacher.lastname = this.teacherForm.get('lastname').value;
            this.teacher.phone_no = this.teacherForm.get('phone_no').value;
            this.teacher.email = this.teacherForm.get('email').value;
          }
        } else if (this.userForm.get('userType').value === 'student') {
          if (this.studentForm.valid) { }
          this.student.firstname = this.teacherForm.get('firstname').value;
          this.student.lastname = this.teacherForm.get('lastname').value;
          this.student.phone_no = this.teacherForm.get('phone_no').value;
          this.student.email = this.teacherForm.get('email').value;
        }
        this.teacherService.addTeacher(this.login, this.teacher);
      }

    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listSchool.filter(school => school.toLowerCase().includes(filterValue));
  }
}