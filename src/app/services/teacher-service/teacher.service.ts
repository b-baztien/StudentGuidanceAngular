import { Injectable } from '@angular/core';
import { University } from 'src/app/model/University';
import { Faculty } from 'src/app/model/Faculty';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Major } from 'src/app/model/Major';
import { Teacher } from 'src/app/model/Teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private firestore: AngularFirestore) {
  }

  getTeacher(teacherId: string) {
    return this.firestore.collection('Teacher').doc(teacherId).snapshotChanges();
  }

  async getTeacherByUsername(username: string) {
    let login: DocumentReference = this.firestore.collection('Login').doc(username).ref;
    console.log(login)
    return await this.firestore.collection('Teacher').ref.where('login', '==', login).get().then(async result => {
      return await result.docs[0];
    });
  }

  addTeacher() {
    let teacher: Teacher = new Teacher();
    teacher.firstname = 'tttt';
    teacher.lastname = 'llll';
    teacher.email = '123@123.com';
    teacher.phone_no = '012345678';
    teacher.school = this.firestore.collection('School').doc('โรงเรียนทดสอบ').ref;

    return this.firestore.collection('Teacher').add(Object.assign({}, teacher));
  }
}
