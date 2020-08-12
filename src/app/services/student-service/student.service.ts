import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  DocumentReference,
  QueryGroupFn,
  QuerySnapshot,
  DocumentData,
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Login } from "src/app/model/Login";
import { School } from "src/app/model/School";
import { Student } from "src/app/model/Student";
import { LoginService } from "../login-service/login.service";
import { SchoolService } from "../school-service/school.service";
import { Alumni } from "./../../model/Alumni";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  constructor(
    private firestore: AngularFirestore,
    private schoolService: SchoolService,
    private loginService: LoginService
  ) {}

  getStudentBySchoolReference(school: DocumentReference) {
    return this.firestore
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
    return this.firestore
      .collection("Student")
      .doc(studentId)
      .snapshotChanges();
  }

  getStudentByCondition(queryGroupFn: QueryGroupFn) {
    return this.firestore
      .collectionGroup("Student", queryGroupFn)
      .snapshotChanges();
  }

  async updateStudent(studentRef: DocumentReference, student: Student) {
    let loginSnapshot = await this.firestore
      .doc(studentRef.path)
      .collection("Login")
      .get()
      .toPromise();

    let login = loginSnapshot.docs[0].data() as Login;

    if (student.student_status == "สำเร็จการศึกษา") {
      let isEmpty = (
        await this.firestore
          .doc(studentRef.path)
          .collection("Alumni")
          .get()
          .toPromise()
      ).empty;

      login.type = "alumni";

      if (isEmpty) {
        let alumni = new Alumni();
        alumni.graduate_year = "" + (new Date().getFullYear() + 543);
        alumni.schoolName = localStorage.getItem("school");
        alumni.username = studentRef.id;
        alumni.status = "ไม่ระบุ";

        this.firestore
          .collection(studentRef.parent)
          .doc(studentRef.id)
          .collection("Alumni")
          .add(Object.assign({}, alumni));
      }
    } else {
      const snapshot = await this.firestore
        .doc(studentRef.path)
        .collection("Alumni")
        .get()
        .toPromise();

      login.type = "student";

      const batch = this.firestore.firestore.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    }

    loginSnapshot.docs[0].ref.update(Object.assign({}, login));

    this.firestore
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

    let school = new School();
    school.school_name = schoolName;
    this.schoolService.addSchool(school);
    await this.firestore
      .collection("School")
      .doc(schoolName)
      .collection("Student")
      .doc(login.username)
      .set(Object.assign({}, student))
      .then(() =>
        this.firestore
          .collection("School")
          .doc(schoolName)
          .collection("Student")
          .doc(login.username)
          .collection("Login")
          .doc(login.username)
          .set(Object.assign({}, login))
      );
  }

  async removeStudent(student: Student) {
    const batch = this.firestore.firestore.batch();

    const alumniSnap = await this.firestore
      .doc(student.ref)
      .collection("Alumni")
      .get()
      .toPromise();
    const loginSnap = await this.firestore
      .doc(student.ref)
      .collection("Login")
      .get()
      .toPromise();
    const entranceExamResultSnap = await this.firestore
      .doc(student.ref)
      .collection("EntranceExamResult")
      .get()
      .toPromise();
    const studentFavoriteSnap = await this.firestore
      .doc(student.ref)
      .collection("StudentFavorite")
      .get()
      .toPromise();
    const studentRecommendSnap = await this.firestore
      .doc(student.ref)
      .collection("StudentRecommend")
      .get()
      .toPromise();

    await this.deleteData(alumniSnap);
    await this.deleteData(loginSnap);
    await this.deleteData(entranceExamResultSnap);
    await this.deleteData(studentFavoriteSnap);
    await this.deleteData(studentRecommendSnap);

    batch.delete(student.ref);
    await batch.commit();
  }

  async deleteData(snapshot: QuerySnapshot<DocumentData>) {
    const batch = this.firestore.firestore.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}
