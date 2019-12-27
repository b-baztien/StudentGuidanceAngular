import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Teacher } from 'src/app/model/Teacher';
import { Subject } from 'rxjs';
import { Login } from 'src/app/model/Login';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  constructor(private firestore: AngularFirestore) { }

  getTeacher(teacherId: string) {
    return this.firestore.collection('Teacher').doc(teacherId).snapshotChanges();
  }

  async getTeacherByUsername(username: string) {
    let login: DocumentReference = this.firestore.collection('Login').doc(username).ref;
    return await this.firestore.collection('Teacher').ref.where('login', '==', login).get().then(async result => {
      return result.docs[0];
    });
  }

  addTeacher(login: Login, teacher: Teacher, increase: boolean) {
    this.firestore.collection('Teacher').doc(login.username).set(Object.assign({}, teacher)).then(() => {
      if (increase) {
        this.incrementTeacherId();
      }
    });
  }

  updateTeacher(teacherId: string, teacher: Teacher) {
    this.firestore.collection('Teacher').doc(teacherId).update(Object.assign({}, teacher));
  }

  getTeacherId() {
    let osbTeacherId = new Subject<string>();
    this.firestore.collection('Teacher').snapshotChanges().subscribe(() => {
      this.firestore.collection('Shards').doc('sequence').ref.get().then(result => {
        osbTeacherId.next(result.data().teacher_id);
      });
    });
    return osbTeacherId.asObservable();
  }

  incrementTeacherId() {
    this.firestore.collection('Teacher').snapshotChanges().subscribe(() => {
      this.firestore.collection('Shards').doc('sequence').ref.get().then(result => {
        let sequenceData = result.data();
        sequenceData.teacher_id += 1;
        this.firestore.collection('Shards').doc('sequence').update(sequenceData);
      });
    });
  }
}
