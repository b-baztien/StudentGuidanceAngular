import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, DocumentReference, QueryGroupFn } from '@angular/fire/firestore';
import { firebase } from '@firebase/app';
import { Subject } from 'rxjs';
import { Student } from 'src/app/model/Student';
import { Login } from 'src/app/model/Login';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(
    private firestore: AngularFirestore,
  ) {
  }

  getStudentBySchoolReference(school: DocumentReference) {
    return this.firestore.collection(school.parent).doc(school.id)
      .collection('Student', query => query.where('student_status', '==', 'กำลังศึกษา').orderBy('firstname'))
      .snapshotChanges().pipe(map(result => result.map(item => item.payload.doc)));
  }

  getStudentByStudentId(studentId: string) {
    return this.firestore.collection('Student').doc(studentId).snapshotChanges();
  }

  getStudentByCondition(studentId: string, queryGroupFn: QueryGroupFn) {
    return this.firestore.collectionGroup('Student', queryGroupFn).snapshotChanges();
  }

  updateStudent(studentRef: DocumentReference, student: Student) {
    return this.firestore.collection(studentRef.parent).doc(studentRef.id).update(Object.assign({}, student));
  }

  addStudent(login: Login, student: Student, increase: boolean) {
    this.firestore.collection('Student').doc(login.username).set(Object.assign({}, student)).then(() => {
      if (increase) {
        this.incrementStudentId();
      }
    });
  }

  getStudentId() {
    let osbStudentId = new Subject<string>();
    this.firestore.collection('Student').snapshotChanges().subscribe(() => {
      this.firestore.collection('Shards').doc('sequence').ref.get().then(result => {
        osbStudentId.next(result.data().student_id);
      });
    });
    return osbStudentId.asObservable();
  }

  incrementStudentId() {
    this.firestore.collection('Student').snapshotChanges().subscribe(() => {
      this.firestore.collection('Shards').doc('sequence').ref.get().then(result => {
        let sequenceData = result.data();
        sequenceData.student_id += 1;
        this.firestore.collection('Shards').doc('sequence').update(sequenceData);
      });
    });
  }
}
