import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Teacher } from 'src/app/model/Teacher';
import { Login } from 'src/app/model/Login';
import { map, filter, find } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  constructor(private angularFirestore: AngularFirestore) { }

  getTeacherByUsername(username: string) {
    return this.angularFirestore.collectionGroup('Teacher').snapshotChanges()
      .pipe(map(result => {
        const teacher = result.find(item => item.payload.doc.id === username);
        return { id: teacher.payload.doc.id, ref: teacher.payload.doc.ref, ...teacher.payload.doc.data() as Teacher } as Teacher;
      }));
  }

  addTeacher(schoolRef: DocumentReference, login: Login, teacher: Teacher) {
    this.angularFirestore.collection(schoolRef.parent).doc(schoolRef.id).collection('Teacher')
      .doc(login.username).set(Object.assign({}, teacher));
  }

  updateTeacher(teacherId: string, teacher: Teacher) {
    this.angularFirestore.collection('Teacher').doc(teacherId).update(Object.assign({}, teacher));
  }
}
