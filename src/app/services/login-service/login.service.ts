import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  DocumentReference,
  QueryFn,
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Teacher } from "src/app/model/Teacher";
import { Login } from "../../model/Login";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private userLogin: Login;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.userLogin = new Login();
  }

  async login(login: Login) {
    return await this.firestore
      .collectionGroup("Login", (query) =>
        query
          .where("username", "==", login.username)
          .where("password", "==", login.password)
      )
      .get()
      .toPromise()
      .then(async (response) => {
        if (response.size === 0) {
          throw new ReferenceError(
            "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้งภายหลัง"
          );
        } else {
          this.userLogin = response.docs[0].data() as Login;
          if (this.userLogin.type === "teacher") {
            await this.firestore
              .doc(response.docs[0].ref.parent.parent)
              .get()
              .toPromise()
              .then((teacherDoc) => {
                const teacher = {
                  id: teacherDoc.id,
                  ...teacherDoc.data(),
                } as Teacher;
                localStorage.setItem("teacher", JSON.stringify(teacher));
                localStorage.setItem("school", teacherDoc.ref.parent.parent.id);
              });
          }
          return this.userLogin.type;
        }
      })
      .catch((error) => {
        console.error((error as Error).stack);
        if (error.code === "unavailable") {
          throw new Error(
            "ไม่พบสัญญาณอินเทอร์เน็ต กรุณาลองใหม่อีกครั้งภายหลัง"
          );
        }
        throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง");
      });
  }

  addUser(user: Login) {
    return this.firestore.collection("Login").add(Object.assign({}, user));
  }

  removeUser(user: Login, login: DocumentReference) {
    if (user.type === "teacher") {
      this.firestore
        .collection("Teacher")
        .ref.where("login", "==", login)
        .get()
        .then((teacherRef) => {
          if (teacherRef.docs[0].exists) {
            let teacher = teacherRef.docs[0];
            this.firestore
              .collection("News")
              .ref.where("teacher", "==", teacher)
              .get()
              .then((listNewsRef) => {
                listNewsRef.docs.forEach((newsRef) => {
                  this.firestore.collection("News").doc(newsRef.id).delete();
                });
              });
            this.firestore.collection("Teacher").doc(teacher.id).delete();
          }
        });
    } else if (user.type === "student") {
      this.firestore
        .collection("Student")
        .ref.where("login", "==", login)
        .get()
        .then((studentRef) => {
          if (studentRef.docs[0].exists) {
            let student = studentRef.docs[0];
            this.firestore.collection("Student").doc(student.id).delete();
          }
        });
    }
    this.firestore.collection("Login").doc(user.username).delete();
  }

  async updateLogin(login: Login) {
    return await this.firestore
      .collectionGroup("Login", (query) =>
        query.where("username", "==", login.username)
      )
      .get()
      .toPromise()
      .then((doc) => {
        this.firestore
          .doc(doc.docs[0].ref.path)
          .update(Object.assign({}, login));

        localStorage.setItem("userData", JSON.stringify(login));
      });
  }

  getAllLogin() {
    return this.firestore
      .collectionGroup("Login")
      .snapshotChanges()
      .pipe(
        map((result) =>
          result.map((item) => {
            const doc = item.payload.doc;
            return {
              id: doc.id,
              ref: doc.ref,
              ...(doc.data() as Login),
            } as Login;
          })
        )
      );
  }

  getLoginByCondition(queryFn: QueryFn) {
    return this.firestore.collectionGroup("Login", queryFn).get();
  }

  logout() {
    localStorage.clear();
    location.reload();
  }
}
