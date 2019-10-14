import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { firebase } from '@firebase/app';
import { Subject } from 'rxjs';
import { Student } from 'src/app/model/Student';
import { Login } from 'src/app/model/Login';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(
    private firestore: AngularFirestore,
  ) {
  }

  getStudentBySchoolId(schoolId: string) {
    let osbStudent = new Subject<Array<QueryDocumentSnapshot<unknown>>>();
    let listStudent = new Array<QueryDocumentSnapshot<unknown>>();
    this.firestore.collection('Student').snapshotChanges().subscribe(stdDoc => {
      stdDoc.forEach(std => {
        let studentRef = std.payload.doc;
        let dupStd = false;
        if ((studentRef.data() as Student).school.id == schoolId && (studentRef.data() as Student).student_status == 'กำลังศึกษา') {
          for (let i = 0; i < listStudent.length; i++) {
            if (listStudent[i].id == studentRef.id) {
              dupStd = true;
              listStudent.splice(i, 1, studentRef);
            }
          }
          if (!dupStd && (studentRef.data() as Student).student_status != 'สำเร็จการศึกษา') {
            listStudent.push(studentRef);
          }
        }
        osbStudent.next(listStudent);
      });
    });
    return osbStudent.asObservable();
  }

  getStudentByStudentId(studentId: string) {
    return this.firestore.collection('Student').doc(studentId).snapshotChanges();
  }

  updateStudent(studentId: string, student: Student) {
    return this.firestore.collection('Student').doc(studentId).update(Object.assign({}, student));
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
