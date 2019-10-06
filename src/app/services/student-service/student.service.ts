import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { UniversityService } from '../university-service/university.service';
import { MajorService } from '../major-service/major.service';
import { University } from 'src/app/model/University';
import { Subject } from 'rxjs';
import { Student } from 'src/app/model/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(
    private firestore: AngularFirestore,
    private universityService: UniversityService,
    private majorService: MajorService,
  ) {
  }

  getStudentBySchoolId(schoolId: string) {
    let osbStudent = new Subject<Array<QueryDocumentSnapshot<unknown>>>();
    let listStudent = new Array<QueryDocumentSnapshot<unknown>>();
    this.firestore.collection('Student').snapshotChanges().subscribe(stdDoc => {
      stdDoc.forEach(std => {
        let studentRef = std.payload.doc;
        let dupStd = false;
        if ((studentRef.data() as Student).school.id == schoolId) {
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
}
