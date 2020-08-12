import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Login } from "src/app/model/Login";
import { School } from "src/app/model/School";
import { Teacher } from "src/app/model/Teacher";
import { LoginService } from "../login-service/login.service";
import { SchoolService } from "../school-service/school.service";

@Injectable({
  providedIn: "root",
})
export class TeacherService {
  constructor(
    private angularFirestore: AngularFirestore,
    private schoolService: SchoolService,
    private loginService: LoginService
  ) {}

  getTeacherByUsername(username: string) {
    return this.angularFirestore
      .collectionGroup("Teacher")
      .snapshotChanges()
      .pipe(
        map((result) => {
          const teacher = result.find(
            (item) => item.payload.doc.id === username
          );
          return {
            id: teacher.payload.doc.id,
            ref: teacher.payload.doc.ref,
            ...(teacher.payload.doc.data() as Teacher),
          } as Teacher;
        })
      );
  }

  async addTeacher(schoolName: string, login: Login, teacher: Teacher) {
    if (
      !(
        await this.loginService
          .getLoginByCondition((query) =>
            query.where("username", "==", login.username)
          )
          .toPromise()
      ).empty
    )
      throw new Error(`มีชื่อผู้ใช้ ${login.username} ในระบบแล้ว`);

    let school = new School();
    school.school_name = schoolName;
    await this.schoolService.addSchool(school);

    await this.angularFirestore
      .collection("School")
      .doc(schoolName)
      .collection("Teacher")
      .doc(login.username)
      .set(Object.assign({}, teacher))
      .then(() =>
        this.angularFirestore
          .collection("School")
          .doc(schoolName)
          .collection("Teacher")
          .doc(login.username)
          .collection("Login")
          .doc(login.username)
          .set(Object.assign({}, login))
      );
  }

  updateTeacher(teacherId: string, teacher: Teacher) {
    let schoolName: string = localStorage.getItem("school");

    delete teacher.id;
    delete teacher.ref;

    this.angularFirestore
      .collection("School")
      .doc(schoolName)
      .collection("Teacher")
      .doc(teacherId)
      .update(Object.assign({}, teacher));
  }
}
