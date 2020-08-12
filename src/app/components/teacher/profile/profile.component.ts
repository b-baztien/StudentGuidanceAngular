import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { Login } from "src/app/model/Login";
import { Teacher } from "src/app/model/Teacher";
import { TeacherService } from "src/app/services/teacher-service/teacher.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { LoginService } from "src/app/services/login-service/login.service";
import { Notifications } from "../../util/notification";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  teacherForm = new FormGroup({
    school: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
    firstname: new FormControl(null, [Validators.required]),
    lastname: new FormControl(null, [Validators.required]),
    phone_no: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])
    ),
    email: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.email])
    ),
  });

  login: Login = new Login();
  teacher: Teacher = new Teacher();
  teacherId: string;
  showData = false;

  imgURL: any = "assets/img/no-photo-available.png";

  constructor(
    private loginService: LoginService,
    private teacherService: TeacherService,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.login = JSON.parse(localStorage.getItem("userData"));
    this.teacherService
      .getTeacherByUsername(this.login.username)
      .subscribe((result) => {
        this.teacherId = result.id;
        this.teacher = result;

        if (this.teacher.image !== undefined) {
          this.afStorage.storage
            .ref(this.teacher.image)
            .getDownloadURL()
            .then((url) => {
              this.imgURL = url;
            });
        }

        this.teacherForm
          .get("school")
          .setValue(this.teacher.ref.parent.parent.id);
        this.teacherForm.get("firstname").setValue(this.teacher.firstname);
        this.teacherForm.get("lastname").setValue(this.teacher.lastname);
        this.teacherForm.get("phone_no").setValue(this.teacher.phone_no);
        this.teacherForm.get("email").setValue(this.teacher.email);

        this.showData = true;
      });
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

  async upload(event) {
    const metadata = {
      contentType: "image/jpeg",
    };

    const fileName = this.afirestore.createId();
    if (event.files[0].type.split("/")[0] == "image") {
      await this.afStorage
        .upload(`teacher/${fileName}`, event.files[0], metadata)
        .then(async (result) => {
          this.teacher.image = result.ref.fullPath;
        });
    }
  }

  preview(event) {
    if (event.target.files[0] !== undefined) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      };
    } else {
      this.imgURL = "assets/img/no-photo-available.png";
    }
  }

  async onSubmit() {
    try {
      if (this.teacherForm.valid) {
        this.spinner.show();

        this.teacher.firstname = this.teacherForm.get("firstname").value;
        this.teacher.lastname = this.teacherForm.get("lastname").value;
        this.teacher.phone_no = this.teacherForm.get("phone_no").value;
        this.teacher.email = this.teacherForm.get("email").value;

        let files: any = document.getElementById("logoImage");
        if (files.files[0] !== undefined) {
          await this.upload(files);
        }

        await this.teacherService.updateTeacher(this.teacherId, this.teacher);
        await this.loginService.updateLogin(this.login);

        new Notifications().showNotification(
          "done",
          "top",
          "right",
          "แก้ไขข้อมูลสำเร็จแล้ว",
          "success",
          "สำเร็จ !"
        );
      }
    } catch (error) {
      console.error(error.message);
      new Notifications().showNotification(
        "close",
        "top",
        "right",
        error.message,
        "danger",
        "แก้ไขข้อมูลล้มเหลว !"
      );
    } finally {
      this.spinner.hide();
    }
  }
}
