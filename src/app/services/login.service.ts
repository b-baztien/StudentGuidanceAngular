import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Login } from '../model/Login';

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
      console.log(error.code);
      if (error === ReferenceError) {
        throw error
      } else {
        if (error.code.toLocaleLowerCase() === 'unavailable') {
          throw new Error(`เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้งภายหลัง`);
        }
        throw new Error(`เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้งภายหลัง`);
      }
    });
  }

  logout() {
  }
}
