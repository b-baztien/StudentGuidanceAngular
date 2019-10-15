import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { Student } from 'src/app/model/Student';

@Injectable({
  providedIn: 'root'
})
export class AlumniService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  getAlumniBySchoolId(schoolId: string) {
    let osbStudent = new Subject<Array<QueryDocumentSnapshot<unknown>>>();
    let listStudent = new Array<QueryDocumentSnapshot<unknown>>();
    this.firestore.collection('Student').snapshotChanges().subscribe(stdDoc => {
      stdDoc.forEach(std => {
        let studentRef = std.payload.doc;
        let dupStd = false;
        if ((studentRef.data() as Student).school.id == schoolId && (studentRef.data() as Student).student_status == 'สำเร็จการศึกษา') {
          for (let i = 0; i < listStudent.length; i++) {
            if (listStudent[i].id == studentRef.id) {
              dupStd = true;
              listStudent.splice(i, 1, studentRef);
            }
          }
          if (!dupStd && (studentRef.data() as Student).student_status != 'กำลังศึกษา') {
            listStudent.push(studentRef);
          }
        }
        osbStudent.next(listStudent);
      });
    });
    return osbStudent.asObservable();
  }
}
