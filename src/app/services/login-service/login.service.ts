import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Login } from '../../model/Login';

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
    return await this.firestore.collection('Login').doc(login.username).ref.get().then(response => {
      this.userLogin = response.data() as Login;
      if (!response.exists || this.userLogin.password !== login.password) {
        throw new ReferenceError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้งภายหลัง');
      } else {
        return this.userLogin.type;
      }
    }).catch((error) => {
      if (error.code === 'unavailable') {
        throw new Error('ไม่พบสัญญาณอินเทอร์เน็ต กรุณาลองใหม่อีกครั้งภายหลัง');
      }
      throw error
    });
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

  getAllLogin() {
    return this.firestore.collection('Login').snapshotChanges();
  }

  logout() {
    localStorage.setItem('userData', null)
    location.reload();
  }
}
