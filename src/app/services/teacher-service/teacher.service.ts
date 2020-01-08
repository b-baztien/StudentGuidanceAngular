import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Teacher } from 'src/app/model/Teacher';
import { Subject } from 'rxjs';
import { Login } from 'src/app/model/Login';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  constructor(private firestore: AngularFirestore) { }

  getTeacherByUsername(username: string) {
    let login: DocumentReference = this.firestore.collection('Login').doc(username).ref;
    return this.firestore.collectionGroup('Teacher', query => query.where('login', '==', login)).snapshotChanges().pipe(map(result => result[0].payload.doc));
  }

  addTeacher(login: Login, teacher: Teacher) {
    this.firestore.collection('Teacher').doc(login.username).set(Object.assign({}, teacher)).then(() => {
    });
  }

  updateTeacher(teacherId: string, teacher: Teacher) {
    this.firestore.collection('Teacher').doc(teacherId).update(Object.assign({}, teacher));
  }
}
