import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Teacher } from 'src/app/model/Teacher';
import { Login } from 'src/app/model/Login';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  constructor(private angularFirestore: AngularFirestore) { }

  getTeacherByUsername(username: string) {
    return this.angularFirestore.collectionGroup('Teacher', query => query.where(firebase.firestore.FieldPath.documentId(), '==', username)).get()
      .pipe(map(result => result.docs[0]));
  }

  addTeacher(schoolRef: DocumentReference, login: Login, teacher: Teacher) {
    this.angularFirestore.collection(schoolRef.parent).doc(schoolRef.id).collection('Teacher')
      .doc(login.username).set(Object.assign({}, teacher));
  }

  updateTeacher(teacherId: string, teacher: Teacher) {
    this.angularFirestore.collection('Teacher').doc(teacherId).update(Object.assign({}, teacher));
  }
}
