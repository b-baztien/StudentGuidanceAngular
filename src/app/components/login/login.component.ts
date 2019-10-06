import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { MatProgressButtonOptions } from 'mat-progress-buttons'
import { LoginService } from 'src/app/services/login-service/login.service';
import { Login } from 'src/app/model/Login';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherService } from 'src/app/services/teacher-service/teacher.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LogInComponent implements OnInit, ErrorStateMatcher {

  loginForm = new FormGroup({
    username: new FormControl(null, [
      Validators.required]),
    password: new FormControl(null, [
      Validators.required]),
  });

  login: Login;

  constructor(
    private loginService: LoginService, 
    private router: Router, 
    private _snackBar: MatSnackBar,
    private teacherService: TeacherService,
    ) { }

  ngOnInit() {
    this.login = new Login();
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'เข้าสู่ระบบ',
    spinnerSize: 20,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    fullWidth: true,
    disabled: false,
    mode: 'indeterminate',
  }

  async onLogin() {
    try {
      if (this.loginForm.valid) {
        this.login.username = this.loginForm.get('username').value;
        this.login.password = this.loginForm.get('password').value;

        this.spinnerButtonOptions.active = true;
        const typeUser = await this.loginService.Login(this.login);
        if (typeUser === 'admin') {
          let userData = {
            role: 'admin'
          }
          localStorage.setItem('userData',JSON.stringify(userData))
          
          this.router.navigate(['./admin']);
        } else if (typeUser === 'teacher') {
         await this.teacherService.getTeacherByUsername(this.login.username).then(teacherRef => {
            console.log(teacherRef.data())
            let userData = {
              email: teacherRef.data().email,
              firstname: teacherRef.data().firstname,
              lastname: teacherRef.data().lastname,
              phone_no: teacherRef.data().phone_no,
              role:'teacher'
            }
            localStorage.setItem('userData',JSON.stringify(userData))
           
          })
          this.router.navigate(['./teacher']);

        } else if (typeUser === 'student') {

        }
        this._snackBar.dismiss();
      }
    } catch (e) {
      this._snackBar.open(e.message, 'ปิด', {
        duration: 5000,
      });
    } finally {
      this.spinnerButtonOptions.active = false;
    }
  }
}