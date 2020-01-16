import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, QueryFn, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Login } from '../../model/Login';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private userLogin: Login;

  constructor(private firestore: AngularFirestore) {
  }

  ngOnInit() {
    this.userLogin = new Login();
  }

  async Login(login: Login) {
    return await this.firestore.collectionGroup('Login',
      query => query.where('username', '==', login.username).where('password', '==', login.password))
      .get().toPromise().then(response => {
        if (response.size === 0) {
          throw new ReferenceError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้งภายหลัง');
        } else {
          this.userLogin = response.docs[0].data() as Login;
          return this.userLogin.type;
        }
      }).catch((error) => {
        console.error(error.message);
        if (error.code === 'unavailable') {
          throw new Error('ไม่พบสัญญาณอินเทอร์เน็ต กรุณาลองใหม่อีกครั้งภายหลัง');
        }
        throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
      });
  }

  addUser(user: Login) {
    return this.firestore.collection('Login').add(Object.assign({}, user));
  }

  removeUser(user: Login, login: DocumentReference) {
    if (user.type === 'teacher') {
      this.firestore.collection('Teacher').ref.where('login', '==', login).get().then(teacherRef => {
        if (teacherRef.docs[0].exists) {
          let teacher = teacherRef.docs[0];
          this.firestore.collection('News').ref.where('teacher', '==', teacher).get().then(listNewsRef => {
            listNewsRef.docs.forEach(newsRef => {
              this.firestore.collection('News').doc(newsRef.id).delete();
            });
          });
          this.firestore.collection('Teacher').doc(teacher.id).delete();
        }
      });
    } else if (user.type === 'student') {
      this.firestore.collection('Student').ref.where('login', '==', login).get().then(studentRef => {
        if (studentRef.docs[0].exists) {
          let student = studentRef.docs[0];
          this.firestore.collection('Student').doc(student.id).delete();
        }
      });
    }
    this.firestore.collection('Login').doc(user.username).delete();
  }

  updateLogin(login: Login) {
    return this.firestore.collection('Login').doc(login.username).update(Object.assign({}, login));
  }

  getAllLogin() {
    return this.firestore.collectionGroup('Login').snapshotChanges()
      .pipe(map(
        result => result.map(item => {
          const doc = item.payload.doc;
          return { id: doc.id, ref: doc.ref, ...doc.data() as Login } as Login;
        })));
  }

  getLoginByCondition(queryFn: QueryFn) {
    return this.firestore.collection('Login', queryFn).snapshotChanges()
      .pipe(map(result => result.map(item => item.payload.doc)));
  }

  logout() {
    localStorage.clear();
    location.reload();
  }
}
