import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Login } from 'src/app/model/Login';
import { LoginService } from 'src/app/services/login-service/login.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {
  userForm = new FormGroup({
    requestData: new FormControl(false),
    username: new FormControl({ value: null, disabled: true }, [
      Validators.required]),
    oldPassword: new FormControl(null, [
      Validators.required]),
    newPassword: new FormControl(null, [
      Validators.required]),
    conPassword: new FormControl(null, [
      Validators.required]),
  });

  login: Login = new Login();
  showData = false;

  imgURL: any = 'assets/img/no-photo-available.png';

  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.login = JSON.parse(localStorage.getItem('userData'));
    this.userForm.get('username').setValue(this.login.username);

    this.showData = true;
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  async onSubmit() {
    try {
      if (this.userForm.valid) {
        this.login.password = this.userForm.get('password').value;

        this.loginService.updateLogin(this.login);

        localStorage.setItem('userData', JSON.stringify(this.login));
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
