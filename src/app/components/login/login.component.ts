import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MatProgressButtonOptions } from "mat-progress-buttons";
import { Login } from "src/app/model/Login";
import { LoginService } from "src/app/services/login-service/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LogInComponent implements OnInit, ErrorStateMatcher {
  loginForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  hide = true;
  login: Login;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.login = new Login();
  }

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }

  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: "เข้าสู่ระบบ",
    spinnerSize: 20,
    raised: true,
    stroked: false,
    buttonColor: "primary",
    spinnerColor: "primary",
    fullWidth: true,
    disabled: false,
    mode: "indeterminate",
  };

  async onLogin() {
    try {
      if (this.loginForm.valid) {
        this.login.username = this.loginForm.get("username").value;
        this.login.password = this.loginForm.get("password").value;

        this.spinnerButtonOptions.active = true;
        const typeUser = await this.loginService.login(this.login);
        this.login.type = typeUser;
        localStorage.setItem("userData", JSON.stringify(this.login));
        if (typeUser === "admin") {
          this.router.navigate(["./admin"]);
        } else if (typeUser === "teacher") {
          this.router.navigate(["./teacher"]);
        } else if (typeUser === "student") {
          throw new Error(
            "เนื่องจากเว็บไซต์ไม่รองรับผู้ใช้ประเภทนักเรียน กรุณาเข้าใช้งานผ่านแอบพลิเคชัน Student Guidance"
          );
        }
        this._snackBar.dismiss();
      }
    } catch (e) {
      this._snackBar.open(e.message, "ปิด", {
        duration: 5000,
      });
    } finally {
      this.spinnerButtonOptions.active = false;
    }
  }
}
