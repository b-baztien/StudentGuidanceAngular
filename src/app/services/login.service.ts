import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Login } from '../model/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userLogin: Login;
  constructor(private firestore: AngularFirestore) { }

  Login(login: Login) {
    this.firestore.collection('Login').doc(login.username).ref.get().then(response => {
    this.userLogin = response[0];
      console.log(this.userLogin);
    });
  }
}
