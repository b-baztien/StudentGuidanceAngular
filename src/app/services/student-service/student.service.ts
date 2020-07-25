import { Alumni } from "./../../model/Alumni";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  DocumentReference,
  QueryGroupFn,
} from "@angular/fire/firestore";
import { Student } from "src/app/model/Student";
import { Login } from "src/app/model/Login";
import { map } from "rxjs/operators";
import { LoginService } from "../login-service/login.service";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  constructor(
    private angularFirestore: AngularFirestore,
    private loginService: LoginService
  ) {}

  getStudentBySchoolReference(school: DocumentReference) {
    return this.angularFirestore
      .collection(school.parent.path)
      .doc(school.id)
      .collection("Student", (query) => query.orderBy("firstname"))
      .snapshotChanges()
      .pipe(
        map((result) => {
          return result
            .filter(
              (item) =>
                (item.payload.doc.data() as Student).student_status ===
                "กำลังศึกษา"
            )
            .map((item) => {
              return {
                id: item.payload.doc.id,
                ref: item.payload.doc.ref,
                ...item.payload.doc.data(),
              } as Student;
            });
        })
      );
  }

  getStudentByStudentId(studentId: string) {
    return this.angularFirestore
      .collection("Student")
      .doc(studentId)
      .snapshotChanges();
  }

  getStudentByCondition(queryGroupFn: QueryGroupFn) {
    return this.angularFirestore
      .collectionGroup("Student", queryGroupFn)
      .snapshotChanges();
  }

  async updateStudent(studentRef: DocumentReference, student: Student) {
    if (student.student_status == "สำเร็จการศึกษา") {
      let isEmpty = (
        await this.angularFirestore
          .doc(studentRef.path)
          .collection("Alumni")
          .get()
          .toPromise()
      ).empty;

      if (isEmpty) {
        let alumni = new Alumni();
        alumni.graduated_year = "" + (new Date().getFullYear() + 543);
        alumni.schoolName = localStorage.getItem("school");
        alumni.username = studentRef.id;

        this.angularFirestore
          .collection(studentRef.parent)
          .doc(studentRef.id)
          .collection("Alumni")
          .add(Object.assign({}, alumni));
      }
    } else {
      const snapshot = await this.angularFirestore
        .doc(studentRef.path)
        .collection("Alumni")
        .get()
        .toPromise();

      const batch = this.angularFirestore.firestore.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    this.angularFirestore
      .collection(studentRef.parent)
      .doc(studentRef.id)
      .update(Object.assign({}, student));
  }

  async addStudent(schoolName: string, login: Login, student: Student) {
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
    await this.angularFirestore
      .collection("School")
      .doc(schoolName)
      .collection("Student")
      .doc(login.username)
      .set(Object.assign({}, student))
      .then(() =>
        this.angularFirestore
          .collection("School")
          .doc(schoolName)
          .collection("Student")
          .doc(login.username)
          .collection("Login")
          .doc(login.username)
          .set(Object.assign({}, login))
      );
  }
}
