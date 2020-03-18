import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm,
  FormBuilder
} from "@angular/forms";
import { Login } from "src/app/model/Login";
import { LoginService } from "src/app/services/login-service/login.service";
import { Notifications } from "../../util/notification";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-password",
  templateUrl: "./edit-password.component.html",
  styleUrls: ["./edit-password.component.css"]
})
export class EditPasswordComponent implements OnInit {
  userForm: FormGroup;

  login: Login = new Login();
  showData = false;

  imgURL: any = "assets/img/no-photo-available.png";

  constructor(
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group(
      {
        requestData: new FormControl(false),
        username: new FormControl({ value: null, disabled: true }, [
          Validators.required
        ]),
        oldPassword: new FormControl(null, [Validators.required]),
        newPassword: new FormControl(null, [Validators.required]),
        confirmPassword: new FormControl(null, [Validators.required])
      },
      {
        validators: [this.matchPasswords, this.matchOldPasswords]
      }
    );
  }

  ngOnInit() {
    this.login = JSON.parse(localStorage.getItem("userData"));
    this.userForm.get("username").setValue(this.login.username);
    this.showData = true;
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

  private matchOldPasswords(group: FormGroup) {
    let login = JSON.parse(localStorage.getItem("userData"));
    let pass = login.password;
    let confirmPass = group.get("oldPassword").value;

    if (pass != confirmPass) {
      group.get("oldPassword").setErrors({ notMatch: true });
    } else {
      return null;
    }
  }

  private matchPasswords(group: FormGroup) {
    let pass = group.get("newPassword").value;
    let confirmPass = group.get("confirmPassword").value;

    if (pass != confirmPass) {
      group.get("confirmPassword").setErrors({ notSame: true });
    } else {
      return null;
    }
  }

  async onSubmit() {
    try {
      if (this.userForm.valid) {
        this.login.password = this.userForm.get("newPassword").value;

        await this.loginService.updateLogin(this.login);

        new Notifications().showNotification(
          "done",
          "top",
          "right",
          "แก้ไขข้อมูลสำเร็จแล้ว",
          "success",
          "สำเร็จ !"
        );
        this.router.navigate(["/teacher"]);
      }
    } catch (error) {
      console.error(error);
      new Notifications().showNotification(
        "close",
        "top",
        "right",
        error.message,
        "danger",
        "แก้ไขข้อมูลล้มเหลว !"
      );
    }
  }
}
